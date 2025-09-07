import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [seed, setSeed] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [seedRes, healthRes] = await Promise.all([
          api.get('/admin/seed-status'),
          api.get('/health'),
        ]);
        if (!mounted) return;
        setSeed(seedRes);
        setHealth(healthRes);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const seedClassics = async () => {
    try {
      await api.post('/admin/seed-classics');
      const refreshed = await api.get('/admin/seed-status');
      setSeed(refreshed);
      alert('Seeded classics successfully');
    } catch (e) {
      alert('Seed failed: ' + (e.message || 'unknown error'));
    }
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="border border-yellow-400/20 p-4">
        <h2 className="uppercase text-sm tracking-widest mb-2">API Health</h2>
        <pre className="text-xs whitespace-pre-wrap text-yellow-200/90">
{JSON.stringify(health, null, 2)}
        </pre>
      </div>
      <div className="border border-yellow-400/20 p-4">
        <div className="flex items-center justify-between">
          <h2 className="uppercase text-sm tracking-widest">System Classics</h2>
          <button onClick={seedClassics} className="text-black bg-yellow-400 px-3 py-1 text-xs uppercase tracking-widest">
            Seed Classics
          </button>
        </div>
        <div className="mt-2 text-xs">
          <div>Count: {seed?.count ?? 0}</div>
          <div>Latest Updated: {seed?.latestUpdatedAt ?? '—'}</div>
          <ul className="list-disc ml-4 mt-2">
            {(seed?.names || []).map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

