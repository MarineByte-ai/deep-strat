#!/usr/bin/env python3
import os
import sys
import shutil
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ChromaDB settings
CHROMA_PERSIST_DIRECTORY = os.getenv('CHROMA_PERSIST_DIRECTORY', './chroma_db')
"stream frontend: clear dialog, prompt change, agentic rag, 复制，点赞，用户数据库"
def check_chroma_directory():
    """Check if ChromaDB directory exists and is accessible"""
    print(f"Checking ChromaDB directory at {CHROMA_PERSIST_DIRECTORY}...")
    
    # Check if directory exists
    if os.path.exists(CHROMA_PERSIST_DIRECTORY):
        print(f"✅ ChromaDB directory exists at {CHROMA_PERSIST_DIRECTORY}")
        
        # Check if directory is writable
        if os.access(CHROMA_PERSIST_DIRECTORY, os.W_OK):
            print("✅ ChromaDB directory is writable")
            return True
        else:
            print(f"❌ ChromaDB directory at {CHROMA_PERSIST_DIRECTORY} is not writable")
            return False
    else:
        print(f"❌ ChromaDB directory does not exist at {CHROMA_PERSIST_DIRECTORY}")
        return False

def create_chroma_directory():
    """Create ChromaDB directory if it doesn't exist"""
    try:
        os.makedirs(CHROMA_PERSIST_DIRECTORY, exist_ok=True)
        print(f"✅ Created ChromaDB directory at {CHROMA_PERSIST_DIRECTORY}")
        return True
    except Exception as e:
        print(f"❌ Failed to create ChromaDB directory: {str(e)}")
        return False

def main():
    """Main function"""
    print("=== ChromaDB Setup Checker ===")
    
    # Check if ChromaDB directory exists and is accessible
    chroma_ready = check_chroma_directory()
    
    if chroma_ready:
        print("\nChromaDB is ready to use. You can proceed with using the RAG system.")
        return
    
    # If ChromaDB directory doesn't exist, create it
    print("\nChromaDB directory is not ready. Let's create it...")
    
    if create_chroma_directory():
        print("\nChromaDB directory created successfully. You can now use the RAG system.")
    else:
        print("\n❌ Failed to create ChromaDB directory.")
        print("Please check your permissions and try again.")

if __name__ == "__main__":
    main() 