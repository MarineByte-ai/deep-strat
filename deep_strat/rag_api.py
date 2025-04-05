from flask import Blueprint, jsonify, request
from deep_strat.rag_qa import RAGQuestionAnswerer
import logging

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
        # Initialize the RAG system
        rag_qa.initialize()
        logger.info("RAG system initialized 1")
        # Load data from the database
        rag_qa.load_data_from_db()
        logger.info("Data loaded from the database 2")
        
        return jsonify({
            "status": "success",
            "message": "RAG system initialized and data loaded successfully"
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