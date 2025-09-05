import { Functions } from 'appwrite';
import { client } from './appwrite';
import { trafficAI } from './aiPrediction';

const functions = new Functions(client);

export const runTrafficPrediction = async (location, timeframe = '1 hour') => {
  try {
    // Try to use Appwrite Function first, fallback to local AI
    try {
      return await functions.createExecution('trafficPrediction', JSON.stringify({ 
        location, 
        timeframe 
      }));
    } catch (functionError) {
      console.log('Using local AI prediction service');
      return await trafficAI.predictTrafficFlow(location, timeframe);
    }
  } catch (error) {
    console.error('Error running traffic prediction:', error);
    // Fallback to local prediction
    return await trafficAI.predictTrafficFlow(location, timeframe);
  }
};

export const optimizeRoute = async (origin, destination, preferences = {}) => {
  try {
    // Try Appwrite Function first, fallback to local optimization
    try {
      return await functions.createExecution('routeOptimization', JSON.stringify({ 
        origin, 
        destination, 
        preferences 
      }));
    } catch (functionError) {
      console.log('Using local route optimization');
      return await trafficAI.optimizeRoute(origin, destination, preferences);
    }
  } catch (error) {
    console.error('Error optimizing route:', error);
    return await trafficAI.optimizeRoute(origin, destination, preferences);
  }
};

export const generateReport = async (startDate, endDate) => {
  try {
    return await functions.createExecution('generateReport', JSON.stringify({ 
      startDate, 
      endDate 
    }));
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};