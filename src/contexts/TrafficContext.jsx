// src/contexts/TrafficContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchTrafficData, 
  subscribeToTrafficUpdates, 
  fetchIncidents,
  fetchPredictions
} from '../services/database';
import { runTrafficPrediction, optimizeRoute } from '../services/functions';

const TrafficContext = createContext();

export const useTraffic = () => {
  const context = useContext(TrafficContext);
  if (!context) {
    throw new Error('useTraffic must be used within a TrafficProvider');
  }
  return context;
};

export const TrafficProvider = ({ children }) => {
  const [trafficData, setTrafficData] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    let unsubscribe;
    
    if (realTimeUpdates) {
      try {
        unsubscribe = subscribeToTrafficUpdates((response) => {
          if (response.events.includes('databases.*.collections.*.documents.*.create')) {
            setTrafficData(prev => [...prev, response.payload]);
          } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
            setTrafficData(prev => 
              prev.map(item => item.$id === response.payload.$id ? response.payload : item)
            );
          }
        });
      } catch (error) {
        console.error('Error setting up real-time updates:', error);
        setError('Real-time updates not available');
      }
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [realTimeUpdates]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [trafficResponse, incidentsResponse, predictionsResponse] = await Promise.all([
        fetchTrafficData(),
        fetchIncidents(),
        fetchPredictions()
      ]);
      
      setTrafficData(trafficResponse.documents);
      setIncidents(incidentsResponse.documents);
      setPredictions(predictionsResponse.documents);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Failed to load data. Using demo data instead.');
      // Set some demo data
      setTrafficData([
        { 
          $id: 'demo-1', 
          congestion: 65, 
          location: 'Downtown', 
          timestamp: new Date().toISOString() 
        },
        { 
          $id: 'demo-2', 
          congestion: 45, 
          location: 'Suburbs', 
          timestamp: new Date().toISOString() 
        }
      ]);
      setIncidents([
        { 
          $id: 'demo-incident-1', 
          title: 'Accident on Main St', 
          location: 'Main St', 
          status: 'active', 
          description: 'Two cars collision', 
          type: 'accident', 
          severity: 'high',
          $createdAt: new Date().toISOString()
        }
      ]);
      setPredictions([
        {
          $id: 'demo-prediction-1',
          location: 'Downtown',
          predictedCongestion: 85,
          timeframe: '2 hours',
          confidence: 92,
          recommendations: ['Use alternate routes', 'Increase public transport frequency'],
          $createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component: wire CRUD to Appwrite-backed helpers
  const addIncident = async (incident) => {
    try {
      // createIncident is in services/database.js
      const res = await (await import('../services/database')).createIncident(incident);
      // if Appwrite returned a document object, normalize it
      const doc = res.document || res;
      setIncidents(prev => [...prev, doc]);
      return doc;
    } catch (err) {
      console.error('addIncident error:', err);
      // optimistic fallback
      const mock = { $id: `local-${Date.now()}`, ...incident, $createdAt: new Date().toISOString() };
      setIncidents(prev => [...prev, mock]);
      return mock;
    }
  };

  const updateIncident = async (incidentId, patch) => {
    try {
      const res = await (await import('../services/database')).updateIncident(incidentId, patch);
      const updated = res.document || res;
      setIncidents(prev => prev.map(i => (i.$id === incidentId ? { ...i, ...updated } : i)));
      return updated;
    } catch (err) {
      console.error('updateIncident error:', err);
      // best-effort local update
      setIncidents(prev => prev.map(i => (i.$id === incidentId ? { ...i, ...patch } : i)));
      return { $id: incidentId, ...patch };
    }
  };

  const deleteIncident = async (incidentId) => {
    try {
      await (await import('../services/database')).deleteIncident(incidentId);
      setIncidents(prev => prev.filter(incident => incident.$id !== incidentId));
      return { $id: incidentId };
    } catch (err) {
      console.error('deleteIncident error:', err);
      // local fallback
      setIncidents(prev => prev.filter(incident => incident.$id !== incidentId));
      return { $id: incidentId };
    }
  };

  const generatePrediction = async (location, timeframe = '1 hour') => {
    try {
      const prediction = await runTrafficPrediction(location, timeframe);
      setPredictions(prev => [prediction, ...prev.slice(0, 9)]); // Keep last 10 predictions
      return prediction;
    } catch (error) {
      console.error('Error generating prediction:', error);
      throw error;
    }
  };

  const findOptimalRoute = async (origin, destination, preferences = {}) => {
    try {
      const optimizedRoutes = await optimizeRoute(origin, destination, preferences);
      setRoutes(optimizedRoutes);
      return optimizedRoutes;
    } catch (error) {
      console.error('Error finding optimal route:', error);
      throw error;
    }
  };

  const toggleRealTimeUpdates = () => {
    setRealTimeUpdates(prev => !prev);
  };

  const value = {
    trafficData,
    incidents,
    predictions,
    routes,
    loading,
    realTimeUpdates,
    error,
    addIncident,
    updateIncident,
    deleteIncident,
    generatePrediction,
    findOptimalRoute,
    toggleRealTimeUpdates,
    refreshData: loadInitialData
  };

  return (
    <TrafficContext.Provider value={value}>
      {children}
    </TrafficContext.Provider>
  );
};