# Database Schema for Smart Traffic Management System

## Collection: `congestion` (Traffic Data)
**Attributes to create:**
- `congestion` - Float - Required - Traffic congestion percentage (0-100)
- `location` - String (255) - Required - Location name/identifier
- `timestamp` - String (255) - Required - ISO timestamp of data collection

**Sample Documents:**
```json
{
  "congestion": 65.5,
  "location": "Downtown",
  "timestamp": "2025-01-07T10:30:00.000Z"
}
```

## Collection: `incidents` (Traffic Incidents)
**Attributes to create:**
- `title` - String (255) - Required - Brief incident title
- `location` - String (255) - Required - Incident location
- `description` - String (1000) - Required - Detailed description
- `type` - String (50) - Required - Incident type (accident, congestion, roadwork, hazard, event)
- `severity` - String (20) - Required - Severity level (low, medium, high, critical)
- `status` - String (20) - Required - Current status (active, investigating, resolved)

**Sample Documents:**
```json
{
  "title": "Accident on Main St",
  "location": "Main St & 1st Ave",
  "description": "Two car collision blocking left lane",
  "type": "accident",
  "severity": "high",
  "status": "active"
}
```

## Collection: `predictions` (AI Traffic Predictions)
**Attributes to create:**
- `location` - String (255) - Required - Location for prediction
- `predictedCongestion` - Integer - Required - Predicted congestion level (0-100)
- `timeframe` - String (50) - Required - Prediction timeframe (e.g., "1 hour", "2 hours")
- `confidence` - Integer - Required - AI confidence level (0-100)
- `recommendations` - String (2000) - Optional - JSON array of recommendations
- `timestamp` - String (255) - Required - When prediction was generated

**Sample Documents:**
```json
{
  "location": "Downtown",
  "predictedCongestion": 85,
  "timeframe": "2 hours",
  "confidence": 92,
  "recommendations": "[\"Use alternate routes\", \"Consider public transport\"]",
  "timestamp": "2025-01-07T10:30:00.000Z"
}
```

## Collection: `routes` (Optimized Routes)
**Attributes to create:**
- `origin` - String (255) - Required - Starting location
- `destination` - String (255) - Required - End location
- `distance` - String (50) - Required - Route distance (e.g., "12.5 km")
- `estimatedTime` - Integer - Required - Estimated time in minutes
- `congestionLevel` - Integer - Required - Route congestion level (0-100)
- `publicTransport` - Boolean - Required - Whether route uses public transport
- `routeName` - String (255) - Optional - Route name/description

**Sample Documents:**
```json
{
  "origin": "Downtown",
  "destination": "Airport",
  "distance": "12.5 km",
  "estimatedTime": 25,
  "congestionLevel": 65,
  "publicTransport": false,
  "routeName": "Fastest Route"
}
```

## Collection: `users` (User Management)
**Attributes to create:**
- `name` - String (255) - Required - User's full name
- `email` - String (255) - Required - User's email address
- `role` - String (50) - Required - User role (admin, operator, viewer)
- `preferences` - String (1000) - Optional - JSON object of user preferences

**Sample Documents:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "preferences": "{\"notifications\": true, \"theme\": \"dark\"}"
}
```

## Permissions for All Collections
Set these permissions for each collection:
- **Read**: Any
- **Create**: Users
- **Update**: Users  
- **Delete**: Users

## Next Steps
1. Create these attributes in each collection in your Appwrite Console
2. The app will automatically work with your database
3. You can add sample data manually or run the seed script