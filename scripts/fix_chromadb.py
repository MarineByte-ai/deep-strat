#!/usr/bin/env python3
"""
Script to fix ChromaDB "no such table: collections" error.
This script deletes the existing ChromaDB directory and creates a fresh one.
"""

import os
import shutil
import sqlite3
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def fix_chromadb():
    """Fix ChromaDB by creating a fresh database."""
    # Get ChromaDB directory from environment or use default
    chroma_dir = os.getenv('CHROMA_PERSIST_DIRECTORY', './chroma_db')
    
    # Check if directory exists
    if os.path.exists(chroma_dir):
        logger.info(f"Removing existing ChromaDB directory: {chroma_dir}")
        try:
            # Remove the directory
            shutil.rmtree(chroma_dir)
            logger.info("Existing ChromaDB directory removed successfully.")
        except Exception as e:
            logger.error(f"Error removing directory: {e}")
            return False
    
    # Create fresh directory
    logger.info(f"Creating fresh ChromaDB directory: {chroma_dir}")
    try:
        os.makedirs(chroma_dir, exist_ok=True)
    except Exception as e:
        logger.error(f"Error creating directory: {e}")
        return False
    
    # Create a new SQLite database file with the required schema
    db_path = os.path.join(chroma_dir, 'chroma.sqlite3')
    logger.info(f"Creating new ChromaDB SQLite database at: {db_path}")
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create the collections table
        cursor.execute('''
        CREATE TABLE collections (
            id TEXT PRIMARY KEY,
            name TEXT,
            metadata TEXT
        )
        ''')
        
        # Commit changes and close connection
        conn.commit()
        conn.close()
        
        logger.info("ChromaDB database created successfully with collections table.")
        return True
    except Exception as e:
        logger.error(f"Error creating SQLite database: {e}")
        return False

if __name__ == "__main__":
    if fix_chromadb():
        logger.info("ChromaDB fix completed successfully!")
        logger.info("You can now initialize your RAG system.")
    else:
        logger.error("Failed to fix ChromaDB.") 