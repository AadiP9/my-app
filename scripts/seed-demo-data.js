#!/usr/bin/env node
// scripts/seed-demo-data.js
// Seed demo traffic and incidents into Appwrite. Usage:
// APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1 APPWRITE_PROJECT=your_project_id APPWRITE_KEY=your_key node scripts/seed-demo-data.js

import { Client, Databases } from 'appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const project = process.env.APPWRITE_PROJECT;
const key = process.env.APPWRITE_KEY;

if (!project || !key) {
  console.error('Please set APPWRITE_PROJECT and APPWRITE_KEY environment variables.');
  process.exit(1);
}

const client = new Client();
client.setEndpoint(endpoint).setProject(project).setKey(key);

const databases = new Databases(client);

// Replace with your database and collection ids or create them in Appwrite
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'trafficDB';
const TRAFFIC_COLLECTION_ID = process.env.APPWRITE_TRAFFIC_COLLECTION_ID || 'trafficData';
const INCIDENTS_COLLECTION_ID = process.env.APPWRITE_INCIDENTS_COLLECTION_ID || 'incidents';

const seed = async () => {
  try {
    console.log('Seeding demo traffic data...');
    const trafficSamples = [
      { congestion: 65, location: 'Downtown', timestamp: new Date().toISOString() },
      { congestion: 45, location: 'Suburbs', timestamp: new Date().toISOString() },
      { congestion: 78, location: 'Bridge', timestamp: new Date().toISOString() }
    ];

    for (const data of trafficSamples) {
      try {
        await databases.createDocument(DATABASE_ID, TRAFFIC_COLLECTION_ID, 'unique()', data);
        console.log('Inserted traffic document:', data.location);
      } catch (err) {
        console.warn('Could not insert traffic document (maybe already exists):', err.message || err);
      }
    }

    console.log('Seeding demo incidents...');
    const incidents = [
      { title: 'Accident on Main St', location: 'Main St', status: 'active', description: 'Two cars collision', type: 'accident', severity: 'high' },
      { title: 'Broken traffic light', location: '2nd Ave', status: 'resolved', description: 'Signal failure', type: 'infrastructure', severity: 'medium' }
    ];

    for (const incident of incidents) {
      try {
        await databases.createDocument(DATABASE_ID, INCIDENTS_COLLECTION_ID, 'unique()', incident);
        console.log('Inserted incident:', incident.title);
      } catch (err) {
        console.warn('Could not insert incident (maybe already exists):', err.message || err);
      }
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
};

seed();
