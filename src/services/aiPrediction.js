// src/services/aiPrediction.js
import { Functions } from 'appwrite';
import { client } from './appwrite';
import { createPrediction } from './database';

const functions = new Functions(client);

// AI Traffic Prediction Service
export class TrafficPredictionAI {
  constructor() {
    this.historicalData = [];
    this.patterns = new Map();
  }

  // Simulate AI prediction algorithm
  async predictTrafficFlow(location, timeframe = '1 hour') {
    try {
      // In a real implementation, this would call an Appwrite Function
      // For demo purposes, we'll simulate AI prediction logic
      
      const currentHour = new Date().getHours();
      const dayOfWeek = new Date().getDay();
      
      // Simulate different traffic patterns based on time and location
      let baseCongestion = this.getBaseCongestion(location, currentHour, dayOfWeek);
      
      // Add some randomness and trends
      const weatherFactor = Math.random() * 0.2 - 0.1; // -10% to +10%
      const eventFactor = this.checkForEvents(location);
      const seasonalFactor = this.getSeasonalFactor();
      
      const predictedCongestion = Math.max(0, Math.min(100, 
        baseCongestion + (baseCongestion * weatherFactor) + eventFactor + seasonalFactor
      ));
      
      const confidence = this.calculateConfidence(location, timeframe);
      const recommendations = this.generateRecommendations(predictedCongestion, location);
      
      const prediction = {
        location,
        predictedCongestion: Math.round(predictedCongestion),
        timeframe,
        confidence: Math.round(confidence),
        recommendations,
        factors: {
          weather: Math.round(weatherFactor * 100),
          events: Math.round(eventFactor),
          seasonal: Math.round(seasonalFactor)
        },
        timestamp: new Date().toISOString()
      };
      
      // Store prediction in database
      await createPrediction(prediction);
      
      return prediction;
    } catch (error) {
      console.error('Error in AI prediction:', error);
      throw error;
    }
  }

  getBaseCongestion(location, hour, dayOfWeek) {
    // Simulate different base congestion levels
    const locationFactors = {
      'Downtown': 70,
      'Suburbs': 30,
      'Highway': 60,
      'Bridge': 80,
      'Airport': 50
    };
    
    const base = locationFactors[location] || 50;
    
    // Rush hour patterns
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return base * 1.4; // 40% increase during rush hours
    }
    
    // Weekend patterns
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return base * 0.7; // 30% decrease on weekends
    }
    
    // Night time
    if (hour >= 22 || hour <= 5) {
      return base * 0.3; // 70% decrease at night
    }
    
    return base;
  }

  checkForEvents(location) {
    // Simulate event detection
    const events = [
      { location: 'Downtown', impact: 25, probability: 0.1 },
      { location: 'Stadium', impact: 40, probability: 0.05 },
      { location: 'Convention Center', impact: 30, probability: 0.08 }
    ];
    
    const relevantEvent = events.find(e => e.location === location);
    if (relevantEvent && Math.random() < relevantEvent.probability) {
      return relevantEvent.impact;
    }
    
    return 0;
  }

  getSeasonalFactor() {
    const month = new Date().getMonth();
    // Summer months might have more traffic due to tourism
    if (month >= 5 && month <= 8) {
      return 5; // 5% increase in summer
    }
    // Winter months might have less traffic
    if (month >= 11 || month <= 2) {
      return -3; // 3% decrease in winter
    }
    return 0;
  }

  calculateConfidence(location, timeframe) {
    // Simulate confidence calculation based on data availability
    const baseConfidence = 85;
    const timeframeFactor = timeframe === '1 hour' ? 10 : timeframe === '2 hours' ? 5 : -5;
    const locationFactor = ['Downtown', 'Highway'].includes(location) ? 5 : 0;
    
    return Math.min(95, baseConfidence + timeframeFactor + locationFactor);
  }

  generateRecommendations(congestion, location) {
    const recommendations = [];
    
    if (congestion > 80) {
      recommendations.push('Consider alternate routes');
      recommendations.push('Use public transportation');
      recommendations.push('Delay non-essential trips');
    } else if (congestion > 60) {
      recommendations.push('Allow extra travel time');
      recommendations.push('Check real-time traffic updates');
    } else if (congestion > 40) {
      recommendations.push('Normal traffic conditions expected');
    } else {
      recommendations.push('Optimal travel conditions');
      recommendations.push('Good time for travel');
    }
    
    // Location-specific recommendations
    if (location === 'Downtown') {
      recommendations.push('Consider metro/subway options');
    } else if (location === 'Highway') {
      recommendations.push('Monitor for accidents');
    }
    
    return recommendations;
  }

  // Route optimization algorithm
  async optimizeRoute(origin, destination, preferences = {}) {
    try {
      // Simulate route optimization
      const routes = await this.generateAlternativeRoutes(origin, destination);
      const optimizedRoutes = routes.map(route => ({
        ...route,
        score: this.calculateRouteScore(route, preferences)
      }));
      
      // Sort by score (higher is better)
      return optimizedRoutes.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error optimizing route:', error);
      throw error;
    }
  }

  async generateAlternativeRoutes(origin, destination) {
    // Simulate multiple route options
    return [
      {
        id: 'route-1',
        name: 'Fastest Route',
        distance: '12.5 km',
        estimatedTime: 25,
        congestionLevel: 65,
        tolls: 0,
        publicTransport: false
      },
      {
        id: 'route-2',
        name: 'Scenic Route',
        distance: '15.2 km',
        estimatedTime: 30,
        congestionLevel: 45,
        tolls: 5,
        publicTransport: false
      },
      {
        id: 'route-3',
        name: 'Public Transport',
        distance: '14.0 km',
        estimatedTime: 35,
        congestionLevel: 20,
        tolls: 0,
        publicTransport: true,
        transitOptions: ['Bus Route 42', 'Metro Line 3']
      }
    ];
  }

  calculateRouteScore(route, preferences) {
    let score = 100;
    
    // Time preference (higher weight for faster routes)
    score -= route.estimatedTime * 0.5;
    
    // Congestion preference
    score -= route.congestionLevel * 0.3;
    
    // Distance preference
    score -= parseFloat(route.distance) * 2;
    
    // Toll preference
    if (preferences.avoidTolls && route.tolls > 0) {
      score -= 20;
    }
    
    // Public transport preference
    if (preferences.preferPublicTransport && route.publicTransport) {
      score += 15;
    }
    
    return Math.max(0, score);
  }
}

// Export singleton instance
export const trafficAI = new TrafficPredictionAI();