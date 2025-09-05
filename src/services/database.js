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
const TRAFFIC_COLLECTION_ID = APPWRITE_TRAFFIC_COLLECTION;
const INCIDENTS_COLLECTION_ID = APPWRITE_INCIDENTS_COLLECTION;
const PREDICTIONS_COLLECTION_ID = APPWRITE_PREDICTIONS_COLLECTION;
const ROUTES_COLLECTION_ID = APPWRITE_ROUTES_COLLECTION;

// Traffic Data Operations
export const fetchTrafficData = async () => {
  try {
    return await databases.listDocuments(DATABASE_ID, TRAFFIC_COLLECTION_ID);
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    // Return mock data for development
    return {
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
      ],
    };
  }
};

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
    return await databases.listDocuments(DATABASE_ID, INCIDENTS_COLLECTION_ID);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    // Return mock data for development
    return {
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
      ],
    };
  }
};

export const createIncident = async (data) => {
  try {
    return await databases.createDocument(DATABASE_ID, INCIDENTS_COLLECTION_ID, 'unique()', data);
  } catch (error) {
    console.error('Error creating incident:', error);
    return { $id: `mock-incident-${Date.now()}`, ...data };
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
    return await databases.listDocuments(DATABASE_ID, PREDICTIONS_COLLECTION_ID);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return {
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
    };
  }
};

export const createPrediction = async (data) => {
  try {
    return await databases.createDocument(DATABASE_ID, PREDICTIONS_COLLECTION_ID, 'unique()', data);
  } catch (error) {
    console.error('Error creating prediction:', error);
    return { $id: `mock-prediction-${Date.now()}`, ...data };
  }
};

// Routes Operations
export const fetchOptimalRoutes = async (origin, destination) => {
  try {
    return await databases.listDocuments(DATABASE_ID, ROUTES_COLLECTION_ID);
  } catch (error) {
    console.error('Error fetching routes:', error);
    return {
      documents: [
        {
          $id: 'mock-route-1',
          origin,
          destination,
          distance: '12.5 km',
          estimatedTime: '25 minutes',
          congestionLevel: 'medium',
          alternativeRoutes: 2,
          publicTransportOptions: ['Bus Route 42', 'Metro Line 3'],
          $createdAt: new Date().toISOString(),
        },
      ],
    };
  }
};

export const createRoute = async (data) => {
  try {
    return await databases.createDocument(DATABASE_ID, ROUTES_COLLECTION_ID, 'unique()', data);
  } catch (error) {
    console.error('Error creating route:', error);
    return { $id: `mock-route-${Date.now()}`, ...data };
  }
};

// Subscribe to traffic updates (stub). If realtime is not configured, this
// returns a no-op unsubscribe function. Replace with a real Appwrite Realtime
// implementation when available.
export const subscribeToTrafficUpdates = (callback) => {
  let unsubscribeFn = () => {};

  (async () => {
    try {
      const { Realtime } = await import('appwrite');
      const { client } = await import('./appwrite');

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