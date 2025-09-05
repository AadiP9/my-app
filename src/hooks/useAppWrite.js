import { useState, useEffect } from 'react';
import { databases } from '../services/database';

export const useAppwrite = (collectionId, query = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await databases.listDocuments(
          'trafficDB',
          collectionId,
          query
        );
        setData(response.documents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionId, query]);

  return { data, loading, error };
};