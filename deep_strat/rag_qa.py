import os
from typing import List, Dict, Any, Optional, Iterator, cast
import logging
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from deep_strat.knowledge_agent import KnowledgeEntry, Session
from pydantic import SecretStr
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain_core.runnables import RunnableConfig
from langchain_core.callbacks.base import BaseCallbackHandler
from langchain_core.embeddings import Embeddings

# Import Google GenAI
import google.generativeai as genai
import numpy as np

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

# Get Google API key
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    logger.error("Google API key not found. Please set GOOGLE_API_KEY in your .env file.")
    raise ValueError("Google API key not found. Please set GOOGLE_API_KEY in your .env file.")

# Configure Google GenAI - Called once here
genai.configure(api_key=GOOGLE_API_KEY)
logger.info("Configured Google Generative AI API.")

# Convert API keys to SecretStr
SECRET_OPENAI_API_KEY = SecretStr(OPENAI_API_KEY)

# ChromaDB settings
CHROMA_PERSIST_DIRECTORY = os.getenv('CHROMA_PERSIST_DIRECTORY', './chroma_db')
COLLECTION_NAME = "knowledge_base"

# Google Embedding Model settings
GOOGLE_EMBEDDING_MODEL_NAME = "models/gemini-embed-text-experimental-0307"
EMBEDDING_DIMENSIONALITY = 1024 # Experimental model uses 1024 dimensions

logger.info(f"Using Google Embedding Model: {GOOGLE_EMBEDDING_MODEL_NAME}")
logger.info(f"Embedding Dimensionality: {EMBEDDING_DIMENSIONALITY}")


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


# Custom Google GenAI Embedding class compatible with LangChain
class GoogleGenAIEmbeddings(Embeddings):
    def __init__(
        self,
        model_name: str = GOOGLE_EMBEDDING_MODEL_NAME,
        dimensions: int = EMBEDDING_DIMENSIONALITY
    ):
        self.model_name = model_name
        self.dimensions = dimensions
        logger.info(f"Initialized GoogleGenAIEmbeddings with model {self.model_name}")
        # No specific model object initialization needed for genai.embed_content

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed search docs."""
        try:
            embeddings = []
            for text_batch in self._batch_texts(texts):
                 # Use RETRIEVAL_DOCUMENT task type for document embedding
                 result = genai.embed_content(
                     model=self.model_name,
                     content=text_batch,
                     task_type="RETRIEVAL_DOCUMENT"
                 )
                 # Ensure the response format contains 'embedding'
                 if 'embedding' in result and isinstance(result['embedding'], list):
                     embeddings.extend(result['embedding'])
                 else:
                     logger.error(f"Unexpected response format from embed_content for documents: {result}")
                     # Add fallback zero vectors for the entire batch
                     embeddings.extend([[0.0] * self.dimensions for _ in text_batch])
            
            # Check if the number of embeddings matches the number of texts
            if len(embeddings) != len(texts):
                logger.warning(f"Mismatch between number of texts ({len(texts)}) and embeddings ({len(embeddings)}). Using fallbacks.")
                # Fallback: return zero vectors for all if mismatch occurs
                return [[0.0] * self.dimensions for _ in texts]
                
            return embeddings
        except Exception as e:
            logger.error(f"Error in embed_documents with Google GenAI: {e}")
            return [[0.0] * self.dimensions for _ in texts]

    def embed_query(self, text: str) -> List[float]:
        """Embed query text."""
        try:
            # Use RETRIEVAL_QUERY task type for query embedding
            result = genai.embed_content(
                model=self.model_name,
                content=text,
                task_type="RETRIEVAL_QUERY"
            )
            # Ensure the response format contains 'embedding'
            if 'embedding' in result and isinstance(result['embedding'], list):
                return result['embedding']
            else:
                logger.error(f"Unexpected response format from embed_content for query: {result}")
                return [0.0] * self.dimensions
        except Exception as e:
            logger.error(f"Error in embed_query with Google GenAI: {e}")
            return [0.0] * self.dimensions
            
    def _batch_texts(self, texts: List[str], batch_size: int = 100) -> Iterator[List[str]]:
        """Yield successive batch_size chunks from texts."""
        for i in range(0, len(texts), batch_size):
            yield texts[i:i + batch_size]


class RAGQuestionAnswerer:
    def __init__(self):
        """Initialize the RAG question answering system using Google GenAI Embeddings"""
        # Initialize Google GenAI Embedding model
        try:
            self.embeddings = GoogleGenAIEmbeddings()
        except Exception as e:
            logger.error(f"Failed to initialize GoogleGenAIEmbeddings: {e}")
            raise RuntimeError("Embedding model initialization failed. Check Google API Key and config.") from e
            
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
                collection_name=COLLECTION_NAME
                # collection_metadata={"hnsw:space": "cosine"} # Let Chroma handle defaults
            )
            
            logger.info(f"Connected to ChromaDB at {CHROMA_PERSIST_DIRECTORY}")
        except Exception as e:
            logger.error(f"Failed to connect to ChromaDB: {str(e)}")
            # Check for dimension mismatch error specifically
            if "Expected embedding dimension" in str(e) or "got" in str(e).lower() and "expected" in str(e).lower():
                 logger.error(f"Potential dimension mismatch between model ({EMBEDDING_DIMENSIONALITY}d) and existing Chroma collection.")
                 logger.error("If this is a new setup, try deleting the ./chroma_db directory.")
            raise
            
        # Initialize the QA chain
        try:
            # Create the language model
            self.llm = ChatOpenAI(
                model="gpt-4o-mini",
                temperature=0,
                api_key=SECRET_OPENAI_API_KEY
            )
            
            # Create a streaming version of the language model
            self.streaming_llm = ChatOpenAI(
                model="gpt-4o-mini",
                temperature=0,
                api_key=SECRET_OPENAI_API_KEY,
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
            metadatas = []
            ids = []
            for i, entry in enumerate(entries):
                # Combine topic and content for better context
                text = f"Topic: {entry.topic}\n\nContent: {entry.content}"
                documents.append(text)
                metadatas.append({"source": f"db_entry_{entry.id}", "topic": entry.topic})
                ids.append(f"entry_{entry.id}") # Ensure unique IDs
                
            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            # Note: create_documents may not preserve metadata order perfectly with simple list passing
            # If strict metadata mapping is needed, consider processing chunks individually or using a different approach
            all_docs_content = "\n".join(documents) # Combine all documents into one string for splitting if needed
            chunks_texts = text_splitter.split_text(all_docs_content)

            # Rebuild metadata and IDs based on split chunks - this is complex and might need adjustment
            # based on how text_splitter works and desired metadata granularity.
            # This is a simplified approach assuming metadata applies to the original document.
            chunk_metadatas = []
            chunk_ids = []
            current_pos = 0
            for i, original_doc in enumerate(documents):
                original_doc_len = len(original_doc)
                doc_chunks = text_splitter.split_text(original_doc) # Split original doc to count chunks
                for j in range(len(doc_chunks)):
                    # Find which chunk in chunks_texts corresponds to this part - requires careful index mapping
                    # This part is tricky and likely needs a more robust mapping strategy
                    # For now, assigning metadata based on original doc index
                    chunk_index_in_all = -1 # Placeholder - needs logic to find the right chunk
                    # Simple approximation: Assume chunks maintain order relative to original docs
                    approx_chunk_count_before = sum(len(text_splitter.split_text(d)) for d in documents[:i])
                    chunk_index_in_all = approx_chunk_count_before + j

                    if chunk_index_in_all < len(chunks_texts):
                        chunk_metadatas.append(metadatas[i])
                        chunk_ids.append(f"chunk_{ids[i]}_{j}")
                    else:
                         logger.warning(f"Metadata/ID assignment issue: index {chunk_index_in_all} out of bounds for {len(chunks_texts)} chunks.")

            # Ensure lists have the same length as chunks_texts
            chunk_metadatas = chunk_metadatas[:len(chunks_texts)]
            chunk_ids = chunk_ids[:len(chunks_texts)]

            logger.info(f"Created {len(chunks_texts)} text chunks from {len(documents)} documents")
            if len(chunk_metadatas) != len(chunks_texts) or len(chunk_ids) != len(chunks_texts):
                 logger.error(f"Mismatch after chunking: {len(chunks_texts)} chunks, {len(chunk_metadatas)} metadatas, {len(chunk_ids)} ids. Aborting add.")
                 return

            # Store in ChromaDB
            if not self.initialized:
                self.initialize()
                
            if not self.vector_store:
                raise ValueError("Vector store not initialized")
                
            # Add documents to the vector store with IDs
            try:
                 # ChromaDB API might expect texts, metadatas, ids
                 self.vector_store.add_texts(texts=chunks_texts, metadatas=chunk_metadatas, ids=chunk_ids)
                 logger.info(f"Added {len(chunks_texts)} chunks to the vector store")
            except AttributeError:
                 logger.warning("Chroma instance does not have 'add_texts'. Trying 'add_documents'...")
                 try:
                     # Fallback for older LangChain Chroma or direct Chroma usage
                     from langchain_core.documents import Document # Import only if needed
                     docs_to_add = [Document(page_content=text, metadata=meta) for text, meta in zip(chunks_texts, chunk_metadatas)]
                     self.vector_store.add_documents(docs_to_add, ids=chunk_ids)
                     logger.info(f"Added {len(chunks_texts)} chunks using add_documents method.")
                 except Exception as add_doc_e:
                     logger.error(f"Failed to add documents using add_documents: {add_doc_e}")
                     raise add_doc_e
            except Exception as e:
                 logger.error(f"Failed to add documents to Chroma: {e}")
                 raise e
            
        finally:
            session.close()
            
    def answer_question(self, question: str) -> Dict[str, Any]:
        """Answer a question using the RAG system"""
        if not self.initialized:
            self.initialize()
            
        if not self.qa_chain:
            raise ValueError("QA chain not initialized")
            
        # Add check for vector_store before using it
        if not self.vector_store:
             logger.error("Vector store not initialized in answer_question")
             return {
                 "question": question,
                 "answer": "Error: Vector store not available.",
                 "sources": []
             }
             
        vector_store = self.vector_store # Assign to local variable after check
        
        try:
            # Get answer from the QA chain
            # Retrieve documents to include sources using the local variable
            docs = vector_store.similarity_search(question, k=5)
            source_info = [doc.metadata.get('source', 'Unknown') for doc in docs]
            
            result = self.qa_chain({"query": question})
            
            return {
                "question": question,
                "answer": result["result"],
                "sources": source_info
            }
        except Exception as e:
            logger.error(f"Error answering question: {str(e)}")
            return {
                "question": question,
                "answer": f"Error: {str(e)}",
                "sources": []
            }
            
    def streaming_answer_question(self, question: str) -> Iterator[Dict[str, Any]]:
        """Answer a question using the RAG system with streaming output."""
        if not self.initialized:
            self.initialize()

        if not self.streaming_llm:
            raise ValueError("Streaming LLM not initialized")
        # Re-add explicit check for vector_store before the try block
        if not self.vector_store:
             logger.error("Vector store not initialized in streaming_answer_question")
             yield {
                 "question": question,
                 "answer": "Error: Vector store not available.",
                 "sources": [],
                 "finished": True
             }
             return # Exit the generator

        # Assign to local variable after check to help type checker
        vector_store = self.vector_store

        try:
            # Use the local variable which is guaranteed not None
            docs = vector_store.similarity_search(question, k=5)
            context = "\n\n".join([doc.page_content for doc in docs])
            source_info = [doc.metadata.get('source', 'Unknown') for doc in docs]
            
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
            full_response = ""
            for chunk in self.streaming_llm.stream(formatted_prompt, config={"callbacks": [callback]}):
                current_response = callback.get_current_response()
                full_response = current_response # Keep track of the full response
                yield {
                    "question": question,
                    "answer": current_response,
                    "sources": source_info, # Include sources early
                    "finished": False
                }
            
            # Send one final response indicating completion
            yield {
                "question": question,
                "answer": full_response, # Send the complete final answer
                "sources": source_info,
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
             logger.error("Vector store not initialized in get_relevant_documents")
             return []
             
        vector_store = self.vector_store # Assign to local variable after check
            
        try:
            # Get relevant documents from the vector store
            docs = vector_store.similarity_search(query, k=k)
            
            # Format the results
            results = []
            for i, doc in enumerate(docs):
                results.append({
                    "id": doc.metadata.get('source', f'doc_{i+1}'), # Use source from metadata if available
                    "content": doc.page_content,
                    "metadata": doc.metadata
                })
                
            return results
        except Exception as e:
            logger.error(f"Error getting relevant documents: {str(e)}")
            return [] 