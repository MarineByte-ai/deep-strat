#!/usr/bin/env python3
"""
Test script to check connection to Voyage AI API.
"""

import os
import logging
import voyageai
from pydantic import SecretStr
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
    """Main function to test Voyage AI API connection."""
    # Get Voyage AI API key
    voyage_api_key = os.getenv('VOYAGE_API_KEY')
    if not voyage_api_key:
        logger.error("Voyage AI API key not found. Please set VOYAGE_API_KEY in your .env file.")
        return
    
    try:
        # Initialize client
        logger.info("Testing connection to Voyage AI API...")
        client = voyageai.Client(api_key=voyage_api_key)
        
        # Simple test
        logger.info("Embedding a test text...")
        test_text = "Hello, this is a test."
        response = client.embed([test_text])
        
        # Check response
        if response and len(response) > 0:
            embedding_dim = len(response[0])
            logger.info(f"Success! Received embedding with dimension: {embedding_dim}")
            logger.info("Connection to Voyage AI API is working correctly.")
        else:
            logger.error("No embeddings received in the response.")
            
    except Exception as e:
        logger.error(f"Error connecting to Voyage AI API: {str(e)}")
        logger.error("Please check your API key and internet connection.")

if __name__ == "__main__":
    main() 