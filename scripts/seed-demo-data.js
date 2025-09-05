#!/usr/bin/env node
// scripts/seed-demo-data.js
// Seed demo traffic and incidents into Appwrite.

import { Client, Databases } from 'appwrite';

const endpoint = 'https://fra.cloud.appwrite.io/v1';
const project = 'par1raay2sahm8aarn1';
const key = process.env.APPWRITE_KEY;
const databaseId = '68b596a0003c2896aecb';

if (!key) {
  console.error('Please set APPWRITE_KEY environment variable.');
  console.log('You can get your API key from: https://cloud.appwrite.io/console/project-' + project + '/overview/keys');
  process.exit(1);
}

const client = new Client();
client.setEndpoint(endpoint).setProject(project).setKey(key);

const databases = new Databases(client);

const seed = async () => {
  try {
    console.log('Seeding demo traffic data...');
    const trafficSamples = [
      { congestion: 65, location: 'Downtown', timestamp: new Date().toISOString() },
      { congestion: 45, location: 'Suburbs', timestamp: new Date().toISOString() },
      { congestion: 78, location: 'Bridge', timestamp: new Date().toISOString() },
      { congestion: 82, location: 'Highway', timestamp: new Date().toISOString() },
      { congestion: 35, location: 'Airport', timestamp: new Date().toISOString() }
    ];

    for (const data of trafficSamples) {
      try {
        await databases.createDocument(databaseId, 'trafficData', 'unique()', data);
        console.log('Inserted traffic document:', data.location);
      } catch (err) {
        console.warn('Could not insert traffic document:', err.message || err);
      }
    }

    console.log('Seeding demo incidents...');
    const incidents = [
      { 
        title: 'Accident on Main St', 
        location: 'Main St', 
        status: 'active', 
        description: 'Two cars collision blocking left lane', 
        type: 'accident', 
        severity: 'high' 
      },
      { 
        title: 'Broken traffic light', 
        location: '2nd Ave & Oak St', 
        status: 'investigating', 
        description: 'Traffic signal malfunction causing delays', 
        type: 'infrastructure', 
        severity: 'medium' 
      },
      { 
        title: 'Road construction', 
        location: 'Highway 101', 
        status: 'active', 
        description: 'Lane closure for maintenance work', 
        type: 'roadwork', 
        severity: 'medium' 
      },
      { 
        title: 'Vehicle breakdown', 
        location: 'Bridge entrance', 
        status: 'resolved', 
        description: 'Disabled vehicle removed from roadway', 
        type: 'hazard', 
        severity: 'low' 
      }
    ];

    for (const incident of incidents) {
      try {
        await databases.createDocument(databaseId, 'incidents', 'unique()', incident);
        console.log('Inserted incident:', incident.title);
      } catch (err) {
        console.warn('Could not insert incident:', err.message || err);
      }
    }

    console.log('Seeding demo predictions...');
    const predictions = [
      {
        location: 'Downtown',
        predictedCongestion: 85,
        timeframe: '2 hours',
        confidence: 92,
        recommendations: JSON.stringify(['Use alternate routes', 'Consider public transport']),
        timestamp: new Date().toISOString()
      },
      {
        location: 'Highway',
        predictedCongestion: 70,
        timeframe: '1 hour',
        confidence: 88,
        recommendations: JSON.stringify(['Allow extra travel time', 'Monitor traffic updates']),
        timestamp: new Date().toISOString()
      }
    ];

    for (const prediction of predictions) {
      try {
        await databases.createDocument(databaseId, 'predictions', 'unique()', prediction);
        console.log('Inserted prediction for:', prediction.location);
      } catch (err) {
        console.warn('Could not insert prediction:', err.message || err);
      }
    }

    console.log('\n🎉 Demo data seeding completed successfully!');
    console.log('You can now run: npm run dev');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
};

seed();
