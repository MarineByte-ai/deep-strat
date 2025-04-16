# Setting up Voyage AI Embeddings

## Overview
This guide explains how to set up and use Voyage AI embeddings in our RAG system. The Voyage AI embeddings replace the previous OpenAI embeddings to provide better semantic search capabilities.

## Prerequisites
- A Voyage AI API key (obtain from [https://www.voyageai.com/](https://www.voyageai.com/))
- Python environment with the required dependencies

## Installation
1. Install the required package:
```bash
pip install langchain-voyageai
```

## Configuration
1. Add your Voyage AI API key to your `.env` file:
```
VOYAGE_API_KEY=your_voyage_api_key_here
```

2. Optionally, you can specify which Voyage AI model to use in your `.env` file:
```
VOYAGE_MODEL=voyage-3
```

Available models include:
- `voyage-3-large` (most powerful, but slower)
- `voyage-3` (default, good balance)
- `voyage-3-lite` (fastest)
- `voyage-large-2`
- `voyage-code-2` (specialized for code)
- `voyage-law-2` (specialized for legal documents)
- `voyage-finance-2` (specialized for financial documents)
- `voyage-multilingual-2` (better with multiple languages)

## Testing the Connection
You can test your connection to the Voyage AI API using our test script:

```bash
python scripts/check_voyage_api.py
```

If successful, you should see a message confirming the connection works correctly.

## How It Works
The RAG system now uses Voyage AI's embeddings to convert text into vector representations that capture semantic meaning. These embeddings are stored in ChromaDB and used for semantic search to find relevant context when answering questions.

## Benefits of Voyage AI Embeddings
- Better semantic understanding across various domains
- Support for specialized models (legal, finance, code, etc.)
- Improved multilingual capabilities
- Enhanced performance for domain-specific use cases

## Troubleshooting

### Common Issues

#### "No such table: collections" Error
If you encounter this error, it usually means the ChromaDB database structure needs to be recreated. We've created a special script to fix this issue:

```bash
# Run our fix script to create a properly structured ChromaDB database
python scripts/fix_chromadb.py
```

After running this script, you should be able to initialize your RAG system without issues.

#### API Key Issues
- If you encounter an error about missing the Voyage AI API key, make sure it's properly set in your `.env` file
- The API key must be valid and have sufficient permissions

#### Batch Size Errors
You can adjust the batch size parameter if you're processing large numbers of documents:

```python
embeddings = VoyageAIEmbeddings(
    api_key=SecretStr(VOYAGE_API_KEY),
    model=VOYAGE_MODEL,
    batch_size=16  # Increase for larger batches
)
```

#### Reindexing Existing Data
If you need to reindex your existing data with the new embeddings:

```bash
# Clear the existing vector store
rm -rf ./chroma_db
# Reinitialize and load data
python -c "from deep_strat.rag_qa import RAGQuestionAnswerer; qa = RAGQuestionAnswerer(); qa.initialize(); qa.load_data_from_db()"
``` 