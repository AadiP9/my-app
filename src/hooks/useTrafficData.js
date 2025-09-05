import { useState, useEffect } from 'react';
import { fetchTrafficData, subscribeToTrafficUpdates } from '../services/database';

export const useTrafficData = (realTime = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchTrafficData();
        setData(response.documents);
      } catch (error) {
        console.error('Error fetching traffic data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    let unsubscribe;
    if (realTime) {
      unsubscribe = subscribeToTrafficUpdates((response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          setData(prev => [...prev, response.payload]);
        } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          setData(prev => 
            prev.map(item => item.$id === response.payload.$id ? response.payload : item)
          );
        } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          setData(prev => prev.filter(item => item.$id !== response.payload.$id));
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [realTime]);

  return { data, loading };
};