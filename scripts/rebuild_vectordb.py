#!/usr/bin/env python3
"""
Script to rebuild the vector database with new embeddings.
This is useful when switching embedding models (e.g., from OpenAI to Voyage AI).
"""

import os
import shutil
import logging
from deep_strat.rag_qa import RAGQuestionAnswerer
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def main():
    """Main function to rebuild the vector database."""
    # Get the ChromaDB directory
    chroma_dir = os.getenv('CHROMA_PERSIST_DIRECTORY', './chroma_db')
    logger.info(f"ChromaDB directory: {chroma_dir}")
    
    # Check if the directory exists
    if os.path.exists(chroma_dir):
        # Confirm with user
        print(f"WARNING: This will delete and rebuild the vector database at {chroma_dir}")
        confirmation = input("Are you sure you want to continue? (y/n): ")
        
        if confirmation.lower() != 'y':
            logger.info("Operation cancelled by user.")
            return
        
        # Create backup
        backup_dir = f"{chroma_dir}_backup_{int(time.time())}"
        logger.info(f"Creating backup of existing vector store to {backup_dir}")
        try:
            shutil.copytree(chroma_dir, backup_dir)
            logger.info("Backup created successfully.")
        except Exception as e:
            logger.error(f"Failed to create backup: {str(e)}")
            return
        
        # Delete existing directory
        logger.info("Deleting existing vector store...")
        try:
            shutil.rmtree(chroma_dir)
            logger.info("Existing vector store deleted.")
        except Exception as e:
            logger.error(f"Failed to delete existing vector store: {str(e)}")
            return
    
    # Initialize RAG system
    logger.info("Initializing RAG system with new embeddings...")
    try:
        rag_qa = RAGQuestionAnswerer()
        rag_qa.initialize()
        logger.info("RAG system initialized successfully.")
        
        # Load data
        logger.info("Loading data from database into vector store...")
        rag_qa.load_data_from_db()
        logger.info("Data loaded successfully.")
        
        logger.info("Vector database rebuilt successfully!")
    except Exception as e:
        logger.error(f"Failed to rebuild vector database: {str(e)}")

if __name__ == "__main__":
    import time  # Import here to avoid unused import warning
    main() 