// src/services/appwrite.js
import { Client } from 'appwrite';

// Use Vite environment variables for configuration. These variables should be
// provided at build time (see .env.example).
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT = import.meta.env.VITE_APPWRITE_PROJECT || 'par1raay2sahm8aarn1';
const APPWRITE_DATABASE = import.meta.env.VITE_APPWRITE_DATABASE || '68b596a0003c2896aecb';
const APPWRITE_TRAFFIC_COLLECTION = import.meta.env.VITE_APPWRITE_TRAFFIC_COLLECTION || 'trafficData';
const APPWRITE_INCIDENTS_COLLECTION = import.meta.env.VITE_APPWRITE_INCIDENTS_COLLECTION || 'incidents';
const APPWRITE_PREDICTIONS_COLLECTION = import.meta.env.VITE_APPWRITE_PREDICTIONS_COLLECTION || 'predictions';
const APPWRITE_ROUTES_COLLECTION = import.meta.env.VITE_APPWRITE_ROUTES_COLLECTION || 'routes';

const client = new Client();

client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT);

export { client };

// Export endpoint and project id for direct REST usage from other modules
export { 
  APPWRITE_ENDPOINT, 
  APPWRITE_PROJECT, 
  APPWRITE_DATABASE,
  APPWRITE_TRAFFIC_COLLECTION,
  APPWRITE_INCIDENTS_COLLECTION,
  APPWRITE_PREDICTIONS_COLLECTION,
  APPWRITE_ROUTES_COLLECTION
};