import os
import time
import schedule
from datetime import datetime
from typing import List, Dict
from google import genai
from google.genai import types
from bs4 import BeautifulSoup
import requests
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from dotenv import load_dotenv
import logging
import random

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure APIs
GEMINI_API_KEY = "AIzaSyAi4xdyPr0tyx99uVDoCUrO9gYKhhDFkAs" #os.getenv('GEMINI_API_KEY')

# Validate API key
if not GEMINI_API_KEY:
    logger.error("Invalid or missing Gemini API key. Please check your .env file and ensure you have set a valid API key.")
    raise ValueError("Invalid or missing Gemini API key. Please set a valid API key in your .env file.")

# Initialize Gemini
try:
    client = genai.Client(api_key=GEMINI_API_KEY)
    model = "gemini-2.0-flash"
    logger.info("Successfully initialized Gemini API")
except Exception as e:
    logger.error(f"Failed to initialize Gemini API: {str(e)}")
    if "API key not valid" in str(e):
        logger.error("Please ensure you have set a valid Gemini API key in your .env file.")
    raise

# Database setup
Base = declarative_base()

class KnowledgeEntry(Base):
    __tablename__ = 'knowledge_entries'
    
    id = Column(Integer, primary_key=True)
    topic = Column(String(255))
    content = Column(Text)
    source_url = Column(String(512))
    relevance_score = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create database engine
try:
    engine = create_engine('sqlite:///knowledge_base.db')
    Base.metadata.create_all(engine)
    Session = scoped_session(sessionmaker(bind=engine))
    logger.info("Successfully initialized database")
except Exception as e:
    logger.error(f"Failed to initialize database: {e}")
    raise

class KnowledgeAgent:
    def __init__(self, topics: List[str]):
        self.topics = topics
        self.session = Session()
        self.search_engines = [
            "https://www.google.com/search?q=",
            "https://www.bing.com/search?q=",
            "https://search.yahoo.com/search?p="
        ]
        
    def search_web(self, query: str, num_results: int = 5) -> List[Dict]:
        """Search the web using simple web scraping"""
        try:
            logger.info(f"Searching web for: {query}")
            search_url = random.choice(self.search_engines) + query.replace(" ", "+")
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(search_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            results = []
            
            # Extract links and titles (implementation varies by search engine)
            for link in soup.find_all('a', href=True):
                url = link.get('href')
                if url.startswith('http') and not any(domain in url for domain in ['google.com', 'bing.com', 'yahoo.com']):
                    title = link.get_text().strip()
                    if title and len(results) < num_results:
                        results.append({
                            'title': title,
                            'link': url
                        })
            
            logger.info(f"Found {len(results)} results for query: {query}")
            return results
        except Exception as e:
            logger.error(f"Error during web search: {e}")
            return []

    def extract_content(self, url: str) -> str:
        """Extract content from a webpage"""
        try:
            logger.info(f"Extracting content from: {url}")
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
                
            text = soup.get_text()
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            logger.info(f"Successfully extracted content from: {url}")
            return text[:2000]  # Limit content length
        except Exception as e:
            logger.error(f"Error extracting content from {url}: {e}")
            return ""

    def analyze_relevance(self, content: str, topic: str) -> int:
        """Use Gemini to analyze content relevance"""
        try:
            logger.info(f"Analyzing relevance for topic: {topic}")
            prompt = f"""
            Analyze the relevance of the following content to the topic '{topic}'.
            Rate it from 1-10, where 10 is highly relevant.
            Content: {content[:1000]}
            """
            
            contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=prompt),
                    ],
                ),
            ]
            
            generate_content_config = types.GenerateContentConfig(
                response_mime_type="text/plain",
            )
            
            # Collect the full response text from the stream
            full_response = ""
            for chunk in client.models.generate_content_stream(
                model=model,
                contents=contents,
                config=generate_content_config,
            ):
                if chunk.text:
                    full_response += chunk.text
            
            logger.debug(f"Full response from Gemini: {full_response}")
            
            # Extract number from response
            try:
                score = int(''.join(filter(str.isdigit, full_response)))
                score = min(max(score, 1), 10)  # Ensure score is between 1-10
                logger.info(f"Relevance score for topic {topic}: {score}")
                return score
            except:
                logger.warning("Failed to parse relevance score, using default value")
                return 5
                
        except Exception as e:
            logger.error(f"Error analyzing relevance: {e}")
            return 5

    def store_knowledge(self, topic: str, content: str, source_url: str, relevance_score: int):
        """Store knowledge in the database"""
        try:
            entry = KnowledgeEntry(
                topic=topic,
                content=content,
                source_url=source_url,
                relevance_score=relevance_score
            )
            self.session.add(entry)
            self.session.commit()
            logger.info(f"Successfully stored knowledge for topic: {topic}")
        except Exception as e:
            logger.error(f"Error storing knowledge: {e}")
            self.session.rollback()

    def run(self):
        """Main execution loop"""
        logger.info("Starting knowledge gathering run")
        for topic in self.topics:
            logger.info(f"Processing topic: {topic}")
            
            # Search for new content
            search_results = self.search_web(topic)
            
            for result in search_results:
                url = result.get('link')
                if not url:
                    continue
                    
                # Extract content
                content = self.extract_content(url)
                if not content:
                    continue
                
                # Analyze relevance
                relevance_score = self.analyze_relevance(content, topic)
                
                # Store if relevant enough
                if relevance_score >= 7:
                    self.store_knowledge(topic, content, url, relevance_score)
                    logger.info(f"Stored new knowledge for topic: {topic}")

    def close(self):
        """Close database session"""
        try:
            self.session.close()
            Session.remove()
            logger.info("Successfully closed database session")
        except Exception as e:
            logger.error(f"Error closing database session: {e}")

TOPICS = ["cybersecurity providers", "Customer Relationship Mamanagement", "Artificial Intelligence"]

def main():
    # Example topics
    topics = TOPICS
    
    try:
        # Create and run the agent
        agent = KnowledgeAgent(topics)
        
        # Schedule the agent to run every 6 hours
        schedule.every(6).hours.do(agent.run)
        
        # Run immediately on startup
        agent.run()
        
        # Keep the script running
        while True:
            schedule.run_pending()
            time.sleep(60)
    except KeyboardInterrupt:
        logger.info("Shutting down knowledge agent")
        agent.close()
    except Exception as e:
        logger.error(f"Error in main loop: {e}")
        if 'agent' in locals():
            agent.close()

if __name__ == "__main__":
    main() 