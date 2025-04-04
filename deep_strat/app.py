from flask import Flask, render_template, jsonify
from deep_strat.knowledge_agent import KnowledgeEntry, Session
from sqlalchemy import desc
import json
from deep_strat.search_api import search_bp

app = Flask(__name__)
app.register_blueprint(search_bp)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/knowledge')
def get_knowledge():
    session = Session()
    try:
        entries = session.query(KnowledgeEntry).order_by(desc(KnowledgeEntry.created_at)).all()
        return jsonify([{
            'id': entry.id,
            'topic': entry.topic,
            'content': entry.content[:200] + '...',  # Truncate for display
            'source_url': entry.source_url,
            'relevance_score': entry.relevance_score,
            'created_at': entry.created_at.isoformat()
        } for entry in entries])
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True, port=5001) 