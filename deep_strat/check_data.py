from deep_strat.knowledge_agent import KnowledgeEntry, Session
import json
from datetime import datetime

def load_knowledge_data():
    """Load and display all knowledge entries from the database"""
    session = Session()
    try:
        entries = session.query(KnowledgeEntry).all()
        print(f"Found {len(entries)} knowledge entries in the database.")
        
        for i, entry in enumerate(entries, 1):
            print(f"\n--- Entry {i} ---")
            print(f"ID: {entry.id}")
            print(f"Topic: {entry.topic}")
            print(f"Content (first 100 chars): {entry.content[:100]}...")
            print(f"Source URL: {entry.source_url}")
            print(f"Relevance Score: {entry.relevance_score}")
            print(f"Created At: {entry.created_at}")
            
        return entries
    finally:
        session.close()

def export_to_json(filename="knowledge_data.json"):
    """Export knowledge entries to a JSON file"""
    session = Session()
    try:
        entries = session.query(KnowledgeEntry).all()
        data = []
        
        for entry in entries:
            data.append({
                'id': entry.id,
                'topic': entry.topic,
                'content': entry.content,
                'source_url': entry.source_url,
                'relevance_score': entry.relevance_score,
                'created_at': entry.created_at.isoformat() if entry.created_at is not None else None
            })
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"Exported {len(data)} entries to {filename}")
        return filename
    finally:
        session.close()

if __name__ == "__main__":
    print("Loading knowledge data from database...")
    load_knowledge_data()
    
    print("\nExporting data to JSON...")
    export_to_json() 