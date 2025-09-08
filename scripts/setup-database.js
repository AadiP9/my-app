#!/usr/bin/env node
// scripts/setup-database.js
// Setup Appwrite database collections for the Smart City Traffic Management System

import { Client, Databases, Permission, Role } from 'appwrite';

const endpoint = 'https://fra.cloud.appwrite.io/v1';
const project = 'par1raay2sahm8aarn1';
const key = process.env.APPWRITE_KEY;
const databaseId = '68b596a0003c2896aecb';

if (!key) {
  console.error('Please set APPWRITE_KEY environment variable with your API key.');
  console.log('You can get your API key from: https://cloud.appwrite.io/console/project-' + project + '/overview/keys');
  process.exit(1);
}

const client = new Client();
client.setEndpoint(endpoint).setProject(project).setKey(key);

const databases = new Databases(client);

const setupCollections = async () => {
  try {
    console.log('Setting up database collections...');

    // Traffic Data Collection
    try {
      await databases.createCollection(
        databaseId,
        'trafficData',
        'Traffic Data',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      console.log('✅ Created trafficData collection');

      // Add attributes
      await databases.createFloatAttribute(databaseId, 'trafficData', 'congestion', true);
      await databases.createStringAttribute(databaseId, 'trafficData', 'location', 255, true);
      await databases.createStringAttribute(databaseId, 'trafficData', 'timestamp', 255, true);
      console.log('✅ Added attributes to trafficData collection');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  trafficData collection already exists');
      } else {
        console.error('Error creating trafficData collection:', error.message);
      }
    }

    // Incidents Collection
    try {
      await databases.createCollection(
        databaseId,
        'incidents',
        'Traffic Incidents',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      console.log('✅ Created incidents collection');

      // Add attributes
      await databases.createStringAttribute(databaseId, 'incidents', 'title', 255, true);
      await databases.createStringAttribute(databaseId, 'incidents', 'location', 255, true);
      await databases.createStringAttribute(databaseId, 'incidents', 'description', 1000, true);
      await databases.createStringAttribute(databaseId, 'incidents', 'type', 50, true);
      await databases.createStringAttribute(databaseId, 'incidents', 'severity', 20, true);
      await databases.createStringAttribute(databaseId, 'incidents', 'status', 20, true);
      console.log('✅ Added attributes to incidents collection');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  incidents collection already exists');
      } else {
        console.error('Error creating incidents collection:', error.message);
      }
    }

    // Predictions Collection
    try {
      await databases.createCollection(
        databaseId,
        'predictions',
        'AI Traffic Predictions',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      console.log('✅ Created predictions collection');

      // Add attributes
      await databases.createStringAttribute(databaseId, 'predictions', 'location', 255, true);
      await databases.createIntegerAttribute(databaseId, 'predictions', 'predictedCongestion', true);
      await databases.createStringAttribute(databaseId, 'predictions', 'timeframe', 50, true);
      await databases.createIntegerAttribute(databaseId, 'predictions', 'confidence', true);
      await databases.createStringAttribute(databaseId, 'predictions', 'recommendations', 2000, false);
      await databases.createStringAttribute(databaseId, 'predictions', 'timestamp', 255, true);
      console.log('✅ Added attributes to predictions collection');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  predictions collection already exists');
      } else {
        console.error('Error creating predictions collection:', error.message);
      }
    }

    // Routes Collection
    try {
      await databases.createCollection(
        databaseId,
        'routes',
        'Optimized Routes',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      console.log('✅ Created routes collection');

      // Add attributes
      await databases.createStringAttribute(databaseId, 'routes', 'origin', 255, true);
      await databases.createStringAttribute(databaseId, 'routes', 'destination', 255, true);
      await databases.createStringAttribute(databaseId, 'routes', 'distance', 50, true);
      await databases.createIntegerAttribute(databaseId, 'routes', 'estimatedTime', true);
      await databases.createIntegerAttribute(databaseId, 'routes', 'congestionLevel', true);
      await databases.createBooleanAttribute(databaseId, 'routes', 'publicTransport', true);
      await databases.createStringAttribute(databaseId, 'routes', 'routeName', 255, false);
      console.log('✅ Added attributes to routes collection');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  routes collection already exists');
      } else {
        console.error('Error creating routes collection:', error.message);
      }
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run seed (to add demo data)');
    console.log('2. Run: npm run dev (to start the development server)');

  } catch (error) {
    console.error('Setup failed:', error);
  }
};

setupCollections();
