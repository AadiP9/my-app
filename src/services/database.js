// src/services/database.js
import { Databases } from 'appwrite';
import { 
  client, 
  APPWRITE_DATABASE,
  APPWRITE_TRAFFIC_COLLECTION,
  APPWRITE_INCIDENTS_COLLECTION,
  APPWRITE_PREDICTIONS_COLLECTION,
  APPWRITE_ROUTES_COLLECTION
} from './appwrite';

const databases = new Databases(client);

// Use the imported constants
const DATABASE_ID = APPWRITE_DATABASE;
const TRAFFIC_COLLECTION_ID = APPWRITE_TRAFFIC_COLLECTION; // This is now 'congestion'
const INCIDENTS_COLLECTION_ID = APPWRITE_INCIDENTS_COLLECTION;
const PREDICTIONS_COLLECTION_ID = APPWRITE_PREDICTIONS_COLLECTION;
const ROUTES_COLLECTION_ID = APPWRITE_ROUTES_COLLECTION;

// Helper function to check if we can connect to Appwrite
const checkConnection = async () => {
  try {
    // Try a simple operation to test connectivity
    await databases.listDocuments(DATABASE_ID, TRAFFIC_COLLECTION_ID, []);
    return true;
  } catch (error) {
    console.warn('Appwrite connection test failed:', error.message);
    return false;
  }
};

// Traffic Data Operations
export const fetchTrafficData = async () => {
  try {
    const isConnected = await checkConnection();
    if (!isConnected) {
      console.log('Using mock data due to connection issues');
      return getMockTrafficData();
    }
    
    return await databases.listDocuments(DATABASE_ID, TRAFFIC_COLLECTION_ID);
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    // Return mock data for development
    return getMockTrafficData();
  }
};

const getMockTrafficData = () => ({
  documents: [
    {
      $id: 'mock-1',
      congestion: 65,
      location: 'Downtown',
      timestamp: new Date().toISOString(),
    },
    {
      $id: 'mock-2',
      congestion: 45,
      location: 'Suburbs',
      timestamp: new Date().toISOString(),
    },
    {
      $id: 'mock-3',
      congestion: 78,
      location: 'Bridge',
      timestamp: new Date().toISOString(),
    },
    {
      $id: 'mock-4',
      congestion: 82,
      location: 'Highway',
      timestamp: new Date().toISOString(),
    },
  ],
});

export const addTrafficData = async (data) => {
  try {
    return await databases.createDocument(DATABASE_ID, TRAFFIC_COLLECTION_ID, 'unique()', data);
  } catch (error) {
    console.error('Error adding traffic data:', error);
    // For development, return a mock response
    return { $id: 'mock-id', ...data };
  }
};

// Incidents Operations
export const fetchIncidents = async () => {
  try {
    const isConnected = await checkConnection();
    if (!isConnected) {
      console.log('Using mock incidents due to connection issues');
      return getMockIncidents();
    }
    
    return await databases.listDocuments(DATABASE_ID, INCIDENTS_COLLECTION_ID);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return getMockIncidents();
  }
};

const getMockIncidents = () => ({
  documents: [
    {
      $id: 'mock-incident-1',
      title: 'Accident on Main St',
      location: 'Main St',
      status: 'active',
      description: 'Two cars collision',
      type: 'accident',
      severity: 'high',
      $createdAt: new Date().toISOString(),
    },
    {
      $id: 'mock-incident-2',
      title: 'Road construction',
      location: 'Highway 101',
      status: 'active',
      description: 'Lane closure for maintenance',
      type: 'roadwork',
      severity: 'medium',
      $createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
});

export const createIncident = async (data) => {
  try {
    return await databases.createDocument(DATABASE_ID, INCIDENTS_COLLECTION_ID, 'unique()', data);
  } catch (error) {
    console.error('Error creating incident:', error);
    return { $id: `mock-incident-${Date.now()}`, ...data, $createdAt: new Date().toISOString() };
  }
};

export const updateIncident = async (id, data) => {
  try {
    return await databases.updateDocument(DATABASE_ID, INCIDENTS_COLLECTION_ID, id, data);
  } catch (error) {
    console.error('Error updating incident:', error);
    // Return a best-effort merged object for dev
    return { $id: id, ...data };
  }
};

export const deleteIncident = async (id) => {
  try {
    return await databases.deleteDocument(DATABASE_ID, INCIDENTS_COLLECTION_ID, id);
  } catch (error) {
    console.error('Error deleting incident:', error);
    // For development, return a mock response
    return { $id: id };
  }
};

// Predictions Operations
export const fetchPredictions = async () => {
  try {
    const isConnected = await checkConnection();
    if (!isConnected) {
      console.log('Using mock predictions due to connection issues');
      return getMockPredictions();
    }
    
    return await databases.listDocuments(DATABASE_ID, PREDICTIONS_COLLECTION_ID);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return getMockPredictions();
  }
};

const getMockPredictions = () => ({
  documents: [
    {
      $id: 'mock-prediction-1',
      location: 'Downtown',
      predictedCongestion: 85,
      timeframe: '2 hours',
      confidence: 92,
      recommendations: ['Use alternate routes', 'Increase public transport frequency'],
      $createdAt: new Date().toISOString(),
    },
  ],
});

export const createPrediction = async (data) => {
  try {
    return await databases.createDocument(DATABASE_ID, PREDICTIONS_COLLECTION_ID, 'unique()', data);
  } catch (error) {
    console.error('Error creating prediction:', error);
    return { $id: `mock-prediction-${Date.now()}`, ...data, $createdAt: new Date().toISOString() };
  }
};

// Routes Operations
export const fetchOptimalRoutes = async (origin, destination) => {
  try {
    const isConnected = await checkConnection();
    if (!isConnected) {
      console.log('Using mock routes due to connection issues');
      return getMockRoutes(origin, destination);
    }
    
    return await databases.listDocuments(DATABASE_ID, ROUTES_COLLECTION_ID);
  } catch (error) {
    console.error('Error fetching routes:', error);
    return getMockRoutes(origin, destination);
  }
};

const getMockRoutes = (origin, destination) => ({
  documents: [
    {
      $id: 'mock-route-1',
      origin: origin || 'Downtown',
      destination: destination || 'Airport',
      distance: '12.5 km',
      estimatedTime: 25,
      congestionLevel: 'medium',
      alternativeRoutes: 2,
      publicTransportOptions: ['Bus Route 42', 'Metro Line 3'],
      $createdAt: new Date().toISOString(),
    },
  ],
});

export const createRoute = async (data) => {
  try {
    return await databases.createDocument(DATABASE_ID, ROUTES_COLLECTION_ID, 'unique()', data);
  } catch (error) {
    console.error('Error creating route:', error);
    return { $id: `mock-route-${Date.now()}`, ...data, $createdAt: new Date().toISOString() };
  }
};

// Subscribe to traffic updates with better error handling
export const subscribeToTrafficUpdates = (callback) => {
  let unsubscribeFn = () => {};

  (async () => {
    try {
      const { Realtime } = await import('appwrite');
      const realtime = new Realtime(client);
      
      const response = realtime.subscribe('databases.*.collections.*.documents.*', (res) => {
        callback(res);
      });

      unsubscribeFn = () => response.unsubscribe();
    } catch (err) {
      // Not available or running in an environment without Realtime support.
      console.warn('subscribeToTrafficUpdates: Appwrite Realtime not available, using no-op.');
      unsubscribeFn = () => {};
    }
  })();

  return () => unsubscribeFn();
};