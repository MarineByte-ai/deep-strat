#!/usr/bin/env python
# Test script for the RAG QA system

import logging
import sys
from deep_strat.rag_qa import RAGQuestionAnswerer

# Configure logging to output to console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

def test_rag_initialization():
    """Test initializing the RAG system."""
    try:
        logger.info("Initializing RAG question answerer...")
        rag = RAGQuestionAnswerer()
        rag.initialize()
        logger.info("RAG initialization successful!")
        return rag
    except Exception as e:
        logger.error(f"Error initializing RAG system: {e}")
        return None

def test_document_retrieval(rag):
    """Test document retrieval with a test query."""
    if not rag:
        logger.error("RAG system not initialized, skipping document retrieval test")
        return
    
    test_query = "What are the key features of our product?"
    try:
        logger.info(f"Testing document retrieval with query: '{test_query}'")
        documents = rag.get_relevant_documents(test_query, k=2)
        logger.info(f"Retrieved {len(documents)} documents")
        for i, doc in enumerate(documents):
            logger.info(f"Document {i+1}: {doc['content'][:100]}...")
    except Exception as e:
        logger.error(f"Error retrieving documents: {e}")

def main():
    """Main test function."""
    logger.info("Starting RAG system test")
    
    # Test initialization
    rag = test_rag_initialization()
    
    # Test document retrieval if initialization was successful
    if rag:
        test_document_retrieval(rag)
    
    logger.info("RAG system test completed")

if __name__ == "__main__":
    main() 