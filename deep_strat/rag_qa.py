import os
from typing import List, Dict, Any, Optional, Iterator
import logging
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from deep_strat.knowledge_agent import KnowledgeEntry, Session
from pydantic import SecretStr
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain_core.runnables import RunnableConfig
from langchain_core.callbacks.base import BaseCallbackHandler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get OpenAI API key
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    logger.error("OpenAI API key not found. Please set OPENAI_API_KEY in your .env file.")
    raise ValueError("OpenAI API key not found. Please set OPENAI_API_KEY in your .env file.")

# Convert API key to SecretStr
SECRET_API_KEY = SecretStr(OPENAI_API_KEY)

# ChromaDB settings
CHROMA_PERSIST_DIRECTORY = os.getenv('CHROMA_PERSIST_DIRECTORY', './chroma_db')
COLLECTION_NAME = "knowledge_base"


class StreamingResponseCallback(BaseCallbackHandler):
    """Callback handler for streaming responses."""
    
    def __init__(self):
        self.text = ""
        
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        """Called when the LLM produces a new token."""
        self.text += token
        
    def get_current_response(self) -> str:
        """Get the current response text."""
        return self.text


class RAGQuestionAnswerer:
    def __init__(self):
        """Initialize the RAG question answering system"""
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002",
            api_key=SECRET_API_KEY
        )
        self.vector_store = None  # type: ignore
        self.qa_chain = None  # type: ignore
        self.initialized = False
        self.llm = None  # type: ignore
        self.streaming_llm = None  # type: ignore
        
    def initialize(self):
        """Initialize the vector store and QA chain"""
        if self.initialized:
            return
            
        logger.info("Initializing RAG question answering system...")
        
        # Create or load the ChromaDB vector store
        try:
            # Ensure the directory exists
            os.makedirs(CHROMA_PERSIST_DIRECTORY, exist_ok=True)
            
            # Create the vector store with explicit parameters
            self.vector_store = Chroma(
                persist_directory=CHROMA_PERSIST_DIRECTORY,
                embedding_function=self.embeddings,
                collection_name=COLLECTION_NAME,
                collection_metadata={"hnsw:space": "cosine"}
            )
            logger.info(f"Connected to ChromaDB at {CHROMA_PERSIST_DIRECTORY}")
        except Exception as e:
            logger.error(f"Failed to connect to ChromaDB: {str(e)}")
            raise
            
        # Initialize the QA chain
        try:
            # Create the language model
            self.llm = ChatOpenAI(  # type: ignore
                model="gpt-4o-mini",
                temperature=0,
                api_key=SECRET_API_KEY
            )
            
            # Create a streaming version of the language model
            self.streaming_llm = ChatOpenAI(  # type: ignore
                model="gpt-4o-mini",
                temperature=0,
                api_key=SECRET_API_KEY,
                streaming=True
            )
            
            prompt_template = """
            You are a helpful AI assistant that answers questions based on the provided context.
            Use the following pieces of context to answer the question at the end.
            If you don't know the answer, just say that you don't know, don't try to make up an answer.
            
            Context:
            {context}
            
            Question: {question}
            
            Answer:
            """
            
            PROMPT = PromptTemplate(
                template=prompt_template, input_variables=["context", "question"]
            )
            
            if not self.vector_store:
                raise ValueError("Vector store not initialized")
                
            if not self.llm:
                raise ValueError("Language model not initialized")
                
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=self.vector_store.as_retriever(search_kwargs={"k": 5}),
                chain_type_kwargs={"prompt": PROMPT}
            )
            
            logger.info("QA chain initialized successfully")
            self.initialized = True
        except Exception as e:
            logger.error(f"Failed to initialize QA chain: {str(e)}")
            raise
            
    def load_data_from_db(self):
        """Load data from the database and store it in the vector store"""
        logger.info("Loading data from database...")
        
        session = Session()
        try:
            entries = session.query(KnowledgeEntry).all()
            logger.info(f"Found {len(entries)} entries in the database")
            
            if not entries:
                logger.warning("No entries found in the database")
                return
                
            # Prepare documents for embedding
            documents = []
            for entry in entries:
                # Combine topic and content for better context
                text = f"Topic: {entry.topic}\n\nContent: {entry.content}"
                documents.append(text)
                
            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            chunks = text_splitter.create_documents(documents)
            logger.info(f"Created {len(chunks)} text chunks from {len(documents)} documents")
            
            # Store in ChromaDB
            if not self.initialized:
                self.initialize()
                
            if not self.vector_store:
                raise ValueError("Vector store not initialized")
                
            # Add documents to the vector store
            self.vector_store.add_documents(chunks)
            # ChromaDB automatically persists changes
            logger.info(f"Added {len(chunks)} chunks to the vector store")
            
        finally:
            session.close()
            
    def answer_question(self, question: str) -> Dict[str, Any]:
        """Answer a question using the RAG system"""
        if not self.initialized:
            self.initialize()
            
        if not self.qa_chain:
            raise ValueError("QA chain not initialized")
            
        try:
            # Get answer from the QA chain
            result = self.qa_chain({"query": question})
            
            return {
                "question": question,
                "answer": result["result"],
                "sources": []  # We could add source tracking here if needed
            }
        except Exception as e:
            logger.error(f"Error answering question: {str(e)}")
            return {
                "question": question,
                "answer": f"Error: {str(e)}",
                "sources": []
            }
            
    def streaming_answer_question(self, question: str) -> Iterator[Dict[str, Any]]:
        """
        Answer a question using the RAG system with streaming output.
        
        Args:
            question: The question to ask
            
        Yields:
            Dict containing the current state of the response
        """
        if not self.initialized:
            self.initialize()
            
        if not self.streaming_llm or not self.vector_store:
            raise ValueError("Streaming LLM or vector store not initialized")
            
        try:
            # Get relevant documents
            docs = self.vector_store.similarity_search(question, k=5)
            context = "\n\n".join([doc.page_content for doc in docs])
            
            # Create prompt
            prompt_template = """
            You are a helpful AI assistant that answers questions based on the provided context.
            Use the following pieces of context to answer the question at the end.
            If you don't know the answer, just say that you don't know, don't try to make up an answer.
            
            Context:
            {context}
            
            Question: {question}
            
            Answer:
            """
            
            PROMPT = PromptTemplate(
                template=prompt_template, 
                input_variables=["context", "question"]
            )
            
            # Create callback
            callback = StreamingResponseCallback()
            
            # Format prompt
            formatted_prompt = PROMPT.format(context=context, question=question)
            
            # Stream the answer
            for chunk in self.streaming_llm.stream(formatted_prompt, config={"callbacks": [callback]}):
                current_response = callback.get_current_response()
                yield {
                    "question": question,
                    "answer": current_response,
                    "sources": [],
                    "finished": False
                }
            
            # Send one final response indicating completion
            yield {
                "question": question,
                "answer": callback.get_current_response(),
                "sources": [],
                "finished": True
            }
            
        except Exception as e:
            logger.error(f"Error streaming answer: {str(e)}")
            yield {
                "question": question,
                "answer": f"Error: {str(e)}",
                "sources": [],
                "finished": True
            }
            
    def get_relevant_documents(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        """Get relevant documents for a query"""
        if not self.initialized:
            self.initialize()
            
        if not self.vector_store:
            raise ValueError("Vector store not initialized")
            
        try:
            # Get relevant documents from the vector store
            docs = self.vector_store.similarity_search(query, k=k)
            
            # Format the results
            results = []
            for i, doc in enumerate(docs):
                results.append({
                    "id": i + 1,
                    "content": doc.page_content,
                    "metadata": doc.metadata
                })
                
            return results
        except Exception as e:
            logger.error(f"Error getting relevant documents: {str(e)}")
            return [] 