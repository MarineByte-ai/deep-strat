import pytest
import pandas as pd
import numpy as np
from deep_strat.strategy import DeepStrat

@pytest.fixture
def sample_data():
    """Create sample market data for testing."""
    dates = pd.date_range(start='2023-01-01', end='2023-01-10', freq='D')
    data = {
        'open': np.random.uniform(100, 110, len(dates)),
        'high': np.random.uniform(110, 120, len(dates)),
        'low': np.random.uniform(90, 100, len(dates)),
        'close': np.random.uniform(100, 110, len(dates)),
        'volume': np.random.uniform(1000, 2000, len(dates))
    }
    return pd.DataFrame(data, index=dates)

@pytest.fixture
def strategy():
    """Create a DeepStrat instance for testing."""
    return DeepStrat(
        symbol="BTC/USD",
        timeframe="1d",
        risk_per_trade=0.02,
        max_positions=3
    )

def test_strategy_initialization(strategy):
    """Test if strategy initializes with correct parameters."""
    assert strategy.symbol == "BTC/USD"
    assert strategy.timeframe == "1d"
    assert strategy.risk_per_trade == 0.02
    assert strategy.max_positions == 3
    assert strategy.positions == []
    assert strategy.trades == []

def test_signal_generation(strategy, sample_data):
    """Test basic signal generation."""
    # Add some technical indicators to make the data more realistic
    sample_data['sma_20'] = sample_data['close'].rolling(window=20).mean()
    sample_data['sma_50'] = sample_data['close'].rolling(window=50).mean()
    
    # Generate signals
    signals = strategy.generate_signals(sample_data)
    
    # Basic assertions
    assert isinstance(signals, pd.DataFrame)
    assert 'signal' in signals.columns
    assert signals['signal'].isin([-1, 0, 1]).all()  # Signals should be -1, 0, or 1

def test_position_management(strategy, sample_data):
    """Test basic position management."""
    # Add some technical indicators
    sample_data['sma_20'] = sample_data['close'].rolling(window=20).mean()
    sample_data['sma_50'] = sample_data['close'].rolling(window=50).mean()
    
    # Generate signals
    signals = strategy.generate_signals(sample_data)
    
    # Update positions
    strategy.update_positions(signals, sample_data)
    
    # Basic assertions
    assert isinstance(strategy.positions, list)
    assert len(strategy.positions) <= strategy.max_positions 