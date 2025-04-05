# Deep Strat - Knowledge Agent with RAG

A knowledge management system with RAG-based question answering capabilities.

## Features

- Knowledge base management
- RAG-based question answering with streaming support
- Vector search using ChromaDB
- OpenAI integration for embeddings and LLM

## Setup

### Prerequisites

- Python 3.8+
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/deep-strat.git
cd deep-strat
```

2. Create and activate a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

If you encounter any issues with the dependencies, you can try installing them one by one:
```bash
pip install flask==2.0.1
pip install flask-cors==5.0.0
pip install sqlalchemy==1.4.23
pip install python-dotenv==0.19.0
pip install langchain
pip install openai
pip install chromadb
pip install langchain-community
pip install langchain-openai
pip install langchain-chroma
```

4. Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key
CHROMA_PERSIST_DIRECTORY=./chroma_db
```

### Setting up ChromaDB

ChromaDB is used for vector storage. It's a local database that doesn't require a separate server:

1. Check if ChromaDB is ready:
```bash
python check_chroma.py
```

2. The script will create the necessary directory if it doesn't exist.

## Usage

### Starting the Application

```bash
python -m deep_strat.app
```

The application will be available at http://localhost:5001

### Using the RAG System

1. Initialize the RAG system by clicking the "Initialize RAG System" button on the dashboard.
2. Choose whether to use streaming responses by toggling the "Use streaming response" checkbox.
3. Ask questions in the question input field.
4. View answers in real-time (if streaming is enabled) and see relevant documents.
5. If needed, you can cancel a streaming response using the "Cancel" button.

## Streaming Feature

The application supports streaming responses for a better user experience:

- **Real-time responses**: See the answer being generated word by word
- **Cancel option**: Stop the generation process at any time
- **Toggle switch**: Choose between streaming and non-streaming mode

## Troubleshooting

### ChromaDB Issues

If you encounter issues with ChromaDB:

1. Make sure the ChromaDB directory exists and is writable.
2. Run the ChromaDB checker script:
```bash
python check_chroma.py
```
3. Follow the instructions provided by the script.

### OpenAI API Issues

If you encounter issues with the OpenAI API:

1. Make sure your OpenAI API key is correctly set in the `.env` file.
2. Check if you have sufficient credits in your OpenAI account.
3. Verify that your API key has access to the required models (gpt-4o-mini and text-embedding-ada-002).

### Dependency Issues

If you encounter issues with dependencies:

1. Make sure you have the latest version of pip:
```bash
pip install --upgrade pip
```

2. Try installing the dependencies one by one as shown in the installation section.

3. If you're still having issues, try using a different Python version or creating a new virtual environment.

## License

MIT
