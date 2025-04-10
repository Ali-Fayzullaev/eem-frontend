import { useEffect, useState, useCallback } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    if (!url) {
      setError(new Error("URL is required"));
      return;
    }
    setLoading(true);

    try {
      const req = await fetch(url);
      if (!req.ok) {
        throw new Error("Not found :( ");
      }
      const data = await req.json();
      setData(data);
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useFetch;
