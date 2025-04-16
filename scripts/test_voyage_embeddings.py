#!/usr/bin/env python3
"""
Test script for Voyage AI embeddings.
This script demonstrates the basic usage of Voyage AI embeddings in our system.
"""

import os
import logging
from dotenv import load_dotenv
from langchain_voyageai import VoyageAIEmbeddings
from pydantic import SecretStr
import numpy as np

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def cosine_similarity(a, b):
    """Calculate cosine similarity between two vectors."""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def main():
    """Main function to test Voyage AI embeddings."""
    # Get Voyage AI API key
    voyage_api_key = os.getenv('VOYAGE_API_KEY')
    if not voyage_api_key:
        logger.error("Voyage AI API key not found. Please set VOYAGE_API_KEY in your .env file.")
        return
    
    # Get Voyage model (default to voyage-3)
    voyage_model = os.getenv('VOYAGE_MODEL', 'voyage-3')
    logger.info(f"Using Voyage AI model: {voyage_model}")
    
    # Create the embeddings object
    embeddings = VoyageAIEmbeddings(
        api_key=SecretStr(voyage_api_key),
        model=voyage_model,
        batch_size=8  # Default batch size
    )
    
    # Example texts to embed
    texts = [
        "The company specializes in artificial intelligence solutions.",
        "We provide cutting-edge machine learning services.",
        "Our focus is on sustainable energy and environmental protection.",
        "The financial results for Q3 showed significant improvement."
    ]
    
    # Create embeddings
    logger.info("Generating embeddings for test texts...")
    embedded_texts = embeddings.embed_documents(texts)
    
    # Print embedding dimensions
    logger.info(f"Embedding dimensions: {len(embedded_texts[0])}")
    
    # Test query
    query = "What services do you offer in AI?"
    logger.info(f"Test query: '{query}'")
    
    # Embed query
    embedded_query = embeddings.embed_query(query)
    
    # Calculate similarities
    logger.info("Calculating similarities between query and documents...")
    similarities = [
        cosine_similarity(embedded_query, doc_embedding)
        for doc_embedding in embedded_texts
    ]
    
    # Print results
    logger.info("Results:")
    for i, (text, similarity) in enumerate(zip(texts, similarities)):
        logger.info(f"Document {i+1}: '{text}'")
        logger.info(f"Similarity: {similarity:.4f}")
        logger.info("---")
    
    # Find most similar document
    most_similar_idx = np.argmax(similarities)
    logger.info(f"Most similar document to the query: '{texts[most_similar_idx]}'")
    logger.info(f"Similarity score: {similarities[most_similar_idx]:.4f}")

if __name__ == "__main__":
    main() 