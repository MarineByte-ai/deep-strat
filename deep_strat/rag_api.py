from flask import Blueprint, jsonify, request, Response, stream_with_context
from deep_strat.rag_qa import RAGQuestionAnswerer
import logging
import json
import os
from dotenv import load_dotenv

# Configure logging
logger = logging.getLogger(__name__)

# Create a Blueprint for the RAG API
rag_bp = Blueprint('rag', __name__)

# Initialize the RAG question answerer
rag_qa = RAGQuestionAnswerer()

@rag_bp.route('/api/rag/initialize', methods=['POST'])
def initialize_rag():
    """Initialize the RAG system and load data from the database"""
    try:
        # Reload environment variables to catch any changes
        load_dotenv(override=True)
        
        # Check for OpenAI API key
        if not os.getenv('OPENAI_API_KEY'):
            return jsonify({
                "status": "error",
                "message": "OpenAI API key not found. Please set OPENAI_API_KEY in your .env file."
            }), 500
            
        # Check for Voyage AI API key
        if not os.getenv('VOYAGE_API_KEY'):
            return jsonify({
                "status": "error",
                "message": "Voyage AI API key not found. Please set VOYAGE_API_KEY in your .env file."
            }), 500
        
        # Initialize the RAG system
        rag_qa.initialize()

        # Load data from the database
        rag_qa.load_data_from_db()

        
        return jsonify({
            "status": "success",
            "message": "RAG system initialized and data loaded successfully",
            "embedding_model": os.getenv('VOYAGE_MODEL', 'voyage-3')
        })
    except Exception as e:
        logger.error(f"Error initializing RAG system: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Error initializing RAG system: {str(e)}"
        }), 500

@rag_bp.route('/api/rag/ask', methods=['POST'])
def ask_question():
    """Ask a question to the RAG system"""
    try:
        data = request.json
        if not data or 'question' not in data:
            return jsonify({
                "status": "error",
                "message": "Question is required"
            }), 400
            
        question = data['question']
        
        # Get answer from the RAG system
        result = rag_qa.answer_question(question)
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error answering question: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Error answering question: {str(e)}"
        }), 500

@rag_bp.route('/api/rag/ask/stream', methods=['POST'])
def ask_question_stream():
    """Ask a question to the RAG system with streaming response"""
    try:
        data = request.json
        if not data or 'question' not in data:
            return jsonify({
                "status": "error",
                "message": "Question is required"
            }), 400
            
        question = data['question']
        
        def generate():
            """Generate streaming response"""
            for chunk in rag_qa.streaming_answer_question(question):
                # Send each chunk as a Server-Sent Event
                yield f"data: {json.dumps(chunk)}\n\n"
        
        # Return streaming response
        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'X-Accel-Buffering': 'no',
                'Content-Type': 'text/event-stream'
            }
        )
    except Exception as e:
        logger.error(f"Error streaming answer: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Error streaming answer: {str(e)}"
        }), 500

@rag_bp.route('/api/rag/relevant-documents', methods=['GET'])
def get_relevant_documents():
    """Get relevant documents for a query"""
    try:
        query = request.args.get('query', '')
        k = request.args.get('k', '5')
        
        if not query:
            return jsonify({
                "status": "error",
                "message": "Query is required"
            }), 400
            
        # Get relevant documents
        results = rag_qa.get_relevant_documents(query, k=int(k))
        
        return jsonify({
            "query": query,
            "results": results
        })
    except Exception as e:
        logger.error(f"Error getting relevant documents: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Error getting relevant documents: {str(e)}"
        }), 500 