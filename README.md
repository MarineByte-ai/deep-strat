# Deep Strat: Advanced Knowledge Agent with RAG & Deep Search

This project aims to build an advanced knowledge management and question-answering system by synergizing Retrieval-Augmented Generation (RAG) with Deep Search techniques. The core innovation lies in treating the underlying vector knowledge base not just as a retrieval index, but as a first-class citizen, continuously enhanced and validated for completeness. A novel "Database Organizer" component proactively manages the knowledge lifecycle.

## Vision

- **Enhanced Vector Database:** Leverage deep search to enrich and refine the vector database, going beyond simple document chunking.
- **Hybrid Retrieval:** Combine vector search (RAG) with real-time deep search during query processing to inject fresh and potentially unstructured knowledge.
- **Proactive Knowledge Management:** Implement a "Database Organizer" to assess knowledge base health, identify gaps ("unknown unknowns"), and trigger knowledge acquisition.
- **Test-Driven Development:** Ensure robustness and facilitate development through a staged approach with clear, testable checkpoints at each stage.

## Core Components

1.  **Vector Database:** Stores embedded knowledge chunks (e.g., using ChromaDB). Enhanced via deep search findings.
2.  **RAG Pipeline:** The core question-answering flow: query embedding, vector retrieval, context augmentation, LLM generation.
3.  **Deep Search Module:** Performs targeted, potentially complex searches (beyond vector similarity) across broader data sources to find specific information or refine existing knowledge.
4.  **Database Organizer:**
    *   Monitors the vector database's health and completeness against a defined set of probe questions or topics.
    *   Identifies knowledge gaps.
    *   Orchestrates deep searches to fill identified gaps, improving the vector database over time.

## Development Stages (Test-Driven Approach)

We will follow a Test-Driven Development (TDD) approach, breaking the project into manageable stages. Each stage will have specific goals and corresponding tests located in the `tests/` directory, mirroring the stage structure (e.g., `tests/stage1/`).

**Stage 1: Foundational RAG Pipeline**
*   **Goal:** Implement basic vector store setup (data loading, embedding), retrieval, and LLM generation.
*   **Checkpoint Test:** `tests/stage1/test_basic_rag.py` (Verify retrieval of relevant chunk for a known query and basic answer generation).

**Stage 2: Deep Search for Vector DB Enhancement**
*   **Goal:** Implement deep search logic triggered manually or on a schedule to find relevant information and update/augment the vector database.
*   **Checkpoint Test:** `tests/stage2/test_db_enhancement.py` (Verify a specific vector is added/updated based on deep search results for a given topic).

**Stage 3: Deep Search for RAG Enhancement (Hybrid Retrieval)**
*   **Goal:** Modify the RAG pipeline to perform a deep search in parallel or sequentially with vector retrieval, incorporating both results into the context for the LLM.
*   **Checkpoint Test:** `tests/stage3/test_hybrid_rag.py` (Verify the final answer incorporates knowledge found *only* via the deep search component for a specific query).

**Stage 4: Database Organizer - Health Check & Gap Detection**
*   **Goal:** Implement the core logic of the Database Organizer to assess the current vector DB against a predefined list of questions/topics and identify gaps.
*   **Checkpoint Test:** `tests/stage4/test_organizer_gap_detection.py` (Verify the organizer correctly identifies a missing topic based on the question list and current DB state).

**Stage 5: Database Organizer - Proactive Knowledge Acquisition**
*   **Goal:** Enable the Database Organizer to automatically trigger the Deep Search Module (from Stage 2) based on gaps detected in Stage 4.
*   **Checkpoint Test:** `tests/stage5/test_organizer_proactive_search.py` (Verify a deep search process is initiated when a knowledge gap is detected).

**Stage 6: Integration, API, and Refinement**
*   **Goal:** Ensure all components work cohesively. Develop API endpoints or a UI for interaction. Refine performance and accuracy.
*   **Checkpoint Test:** `tests/stage6/test_integration.py` (Execute an end-to-end test simulating a user query that utilizes hybrid retrieval and potentially triggers a background DB update).

## Setup

### Prerequisites

- Python 3.8+
- OpenAI API key

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/deep-strat.git # Replace with your repo URL
    cd deep-strat
    ```

2.  Create and activate a virtual environment (recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Create a `.env` file (copy from `.env.example`) and add your OpenAI API key:
    ```dotenv
    OPENAI_API_KEY=your_openai_api_key
    CHROMA_PERSIST_DIRECTORY=./chroma_db # Or your preferred path
    # Add other necessary config later
    ```

## Running Tests

Navigate to the project root directory and run the tests for a specific stage (or all tests) using `pytest`:

```bash
# Run all tests
pytest tests/

# Run tests for a specific stage (e.g., Stage 1)
pytest tests/stage1/
```

## Current Usage (Basic RAG - To be Evolved)

*(Keep relevant parts of the old Usage section here for now, but note it will change as stages progress. You might want to remove the Flask app details initially if focusing on core logic first)*

```bash
# Example: Check ChromaDB setup (if using check_chroma.py)
python check_chroma.py
```

*(Placeholder for future application run commands)*


## License

MIT
