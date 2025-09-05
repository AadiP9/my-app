import { Functions } from 'appwrite';
import { client } from './appwrite';

const functions = new Functions(client);

export const runTrafficPrediction = async (areaId) => {
  try {
    return await functions.createExecution('trafficPrediction', JSON.stringify({ areaId }));
  } catch (error) {
    console.error('Error running traffic prediction:', error);
    throw error;
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