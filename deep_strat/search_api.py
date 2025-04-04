from flask import Blueprint, jsonify, request
from deep_strat.knowledge_agent import KnowledgeEntry, Session
from sqlalchemy import desc, or_, and_

# Create a Blueprint for the search API
search_bp = Blueprint('search', __name__)

@search_bp.route('/api/knowledge/search')
def search_knowledge():
    """Search the knowledge base by topic or content"""
    query = request.args.get('q', '')
    topic = request.args.get('topic', '')
    min_score = request.args.get('min_score', '')
    limit = request.args.get('limit', '100')
    
    # If no search query is provided, return all entries (up to limit)
    if not query and not topic and not min_score:
        session = Session()
        try:
            entries = session.query(KnowledgeEntry).order_by(desc(KnowledgeEntry.relevance_score)).limit(int(limit)).all()
            return format_results(entries)
        finally:
            session.close()
    
    # Build the filter conditions
    conditions = []
    
    if query:
        conditions.append(
            or_(
                KnowledgeEntry.topic.ilike(f'%{query}%'),
                KnowledgeEntry.content.ilike(f'%{query}%')
            )
        )
    
    if topic:
        conditions.append(KnowledgeEntry.topic.ilike(f'%{topic}%'))
    
    if min_score:
        try:
            min_score_value = int(min_score)
            conditions.append(KnowledgeEntry.relevance_score >= min_score_value)
        except ValueError:
            pass
    
    session = Session()
    try:
        # Apply filters if any
        query_obj = session.query(KnowledgeEntry)
        
        # Apply each condition individually
        for condition in conditions:
            query_obj = query_obj.filter(condition)
        
        # Order by relevance score and limit results
        entries = query_obj.order_by(desc(KnowledgeEntry.relevance_score)).limit(int(limit)).all()
        return format_results(entries)
    finally:
        session.close()

def format_results(entries):
    """Format the entries for JSON response"""
    results = []
    for entry in entries:
        # Handle content safely
        content_str = str(entry.content) if entry.content is not None else ""
        truncated_content = content_str[:200] + '...' if len(content_str) > 200 else content_str
            
        results.append({
            'id': entry.id,
            'topic': entry.topic,
            'content': truncated_content,
            'source_url': entry.source_url,
            'relevance_score': entry.relevance_score,
            'created_at': entry.created_at.isoformat()
        })
        
    return jsonify(results) 