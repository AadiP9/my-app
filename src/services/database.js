// src/services/database.js
import { Databases } from 'appwrite';
import { client } from './appwrite';

const databases = new Databases(client);

// Read collection / database IDs from environment (Vite)
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE || 'trafficDB';
const TRAFFIC_COLLECTION_ID = import.meta.env.VITE_APPWRITE_TRAFFIC_COLLECTION || 'trafficData';
const INCIDENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_INCIDENTS_COLLECTION || 'incidents';
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION || 'users';

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