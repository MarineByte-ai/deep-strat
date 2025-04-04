import unittest
from knowledge_agent import KnowledgeAgent, KnowledgeEntry, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

class TestKnowledgeAgent(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Load environment variables
        load_dotenv()
        
        # Create a test database
        cls.engine = create_engine('sqlite:///test_knowledge_base.db')
        # Create all tables
        Base.metadata.create_all(cls.engine)
        cls.Session = sessionmaker(bind=cls.engine)
        
        # Create test topics
        cls.test_topics = ["test topic 1", "test topic 2"]
        
        # Initialize agent with test database
        cls.agent = KnowledgeAgent(cls.test_topics)
        # Override the agent's session with our test session
        cls.agent.session = cls.Session()
        
    def test_agent_initialization(self):
        """Test if the agent initializes correctly"""
        self.assertIsNotNone(self.agent)
        self.assertEqual(self.agent.topics, self.test_topics)
        
    def test_database_connection(self):
        """Test database connection"""
        session = self.Session()
        try:
            # Try to create a test entry
            test_entry = KnowledgeEntry(
                topic="test",
                content="test content",
                source_url="http://test.com",
                relevance_score=5
            )
            session.add(test_entry)
            session.commit()
            
            # Verify the entry was created
            retrieved = session.query(KnowledgeEntry).filter_by(topic="test").first()
            self.assertIsNotNone(retrieved)
            self.assertEqual(retrieved.content, "test content")
            
            # Clean up
            session.delete(retrieved)
            session.commit()
        finally:
            session.close()
            
    def test_search_web(self):
        """Test web search functionality"""
        results = self.agent.search_web("test query")
        self.assertIsInstance(results, list)
        
    @classmethod
    def tearDownClass(cls):
        # Clean up test database
        if os.path.exists('test_knowledge_base.db'):
            os.remove('test_knowledge_base.db')
        cls.agent.close()

if __name__ == '__main__':
    unittest.main() 