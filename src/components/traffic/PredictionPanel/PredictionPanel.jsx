import React, { useState } from 'react';
import { useTraffic } from '../../../contexts/TrafficContext';
import './PredictionPanel.css';

const PredictionPanel = () => {
  const { predictions, generatePrediction } = useTraffic();
  const [selectedLocation, setSelectedLocation] = useState('Downtown');
  const [timeframe, setTimeframe] = useState('1 hour');
  const [loading, setLoading] = useState(false);

  const locations = ['Downtown', 'Suburbs', 'Highway', 'Bridge', 'Airport'];
  const timeframes = ['1 hour', '2 hours', '4 hours', '8 hours'];

  const handleGeneratePrediction = async () => {
    setLoading(true);
    try {
      await generatePrediction(selectedLocation, timeframe);
    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return '#27ae60';
    if (confidence >= 70) return '#f39c12';
    return '#e74c3c';
  };

  const getCongestionColor = (congestion) => {
    if (congestion >= 80) return '#e74c3c';
    if (congestion >= 60) return '#f39c12';
    if (congestion >= 40) return '#f1c40f';
    return '#27ae60';
  };

  return (
    <div className="prediction-panel">
      <div className="panel-header">
        <h3>AI Traffic Predictions</h3>
        <div className="prediction-controls">
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="location-select"
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="timeframe-select"
          >
            {timeframes.map(tf => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
          
          <button 
            onClick={handleGeneratePrediction}
            disabled={loading}
            className="btn btn-primary predict-btn"
          >
            {loading ? 'Predicting...' : 'Predict'}
          </button>
        </div>
      </div>

      <div className="predictions-list">
        {predictions.length === 0 ? (
          <div className="no-predictions">
            <p>No predictions available. Generate your first prediction!</p>
          </div>
        ) : (
          predictions.slice(0, 5).map(prediction => (
            <div key={prediction.$id} className="prediction-item">
              <div className="prediction-header">
                <div className="location-info">
                  <h4>{prediction.location}</h4>
                  <span className="timeframe">{prediction.timeframe} forecast</span>
                </div>
                <div className="prediction-metrics">
                  <div className="congestion-metric">
                    <span 
                      className="congestion-value"
                      style={{ color: getCongestionColor(prediction.predictedCongestion) }}
                    >
                      {prediction.predictedCongestion}%
                    </span>
                    <span className="metric-label">Congestion</span>
                  </div>
                  <div className="confidence-metric">
                    <span 
                      className="confidence-value"
                      style={{ color: getConfidenceColor(prediction.confidence) }}
                    >
                      {prediction.confidence}%
                    </span>
                    <span className="metric-label">Confidence</span>
                  </div>
                </div>
              </div>
              
              {prediction.recommendations && prediction.recommendations.length > 0 && (
                <div className="recommendations">
                  <h5>AI Recommendations:</h5>
                  <ul>
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {prediction.factors && (
                <div className="prediction-factors">
                  <span className="factor">Weather: {prediction.factors.weather > 0 ? '+' : ''}{prediction.factors.weather}%</span>
                  <span className="factor">Events: {prediction.factors.events > 0 ? '+' : ''}{prediction.factors.events}%</span>
                  <span className="factor">Seasonal: {prediction.factors.seasonal > 0 ? '+' : ''}{prediction.factors.seasonal}%</span>
                </div>
              )}
              
              <div className="prediction-time">
                Generated: {new Date(prediction.timestamp || prediction.$createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PredictionPanel;