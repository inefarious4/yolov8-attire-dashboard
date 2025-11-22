import React, { useEffect, useState } from 'react';
import DashboardTable from '../components/DashboardTable';
import { fetchDatasets } from '../services/api';

export interface AttireReading {
  id: string;
  date_captured?: string;
  coat?: boolean;
  shoes?: boolean;
  gloves?: boolean;
}

const DashboardPage: React.FC = () => {
  const [rows, setRows] = useState<AttireReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchDatasets();
        // map backend shape to AttireReading if needed
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        // normalize unknown thrown values into an Error instance
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1>Attire Dashboard</h1>
      {error && <p className="error">{error}</p>}
      <DashboardTable data={rows} loading={loading} />
    </div>
  );
};

export default DashboardPage;