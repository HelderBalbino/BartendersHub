import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminSystem() {
  const [health, setHealth] = useState(null);
  const [pattern, setPattern] = useState('/api/cocktails*');
  const [busy, setBusy] = useState(false);
  const [audit, setAudit] = useState([]);

  useEffect(() => {
    api.get('/health').then(setHealth).catch(() => setHealth(null));
    api.get('/admin/audit?limit=100').then((r)=> setAudit(r?.items || r?.data?.items || [])).catch(()=> setAudit([]));
  }, []);

  const invalidate = async () => {
    setBusy(true);
    try {
      await api.post('/admin/cache/invalidate', { pattern });
      alert('Cache invalidated');
    } catch (e) {
      alert('Failed: ' + (e.message || 'unknown'));
    } finally { setBusy(false); }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="border border-yellow-400/20 p-4">
        <h2 className="uppercase text-sm tracking-widest mb-2">API Health</h2>
        <pre className="text-xs whitespace-pre-wrap text-yellow-200/90">{JSON.stringify(health, null, 2)}</pre>
      </div>
      <div className="border border-yellow-400/20 p-4">
        <h2 className="uppercase text-sm tracking-widest mb-2">Cache Controls</h2>
        <div className="flex gap-2 items-center">
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} className="bg-black border border-yellow-400/30 px-2 py-1 text-sm text-yellow-200 w-72" />
          <button disabled={busy} onClick={invalidate} className="text-black bg-yellow-400 px-3 py-1 text-xs uppercase tracking-widest">Invalidate</button>
        </div>
      </div>
      <div className="md:col-span-2 border border-yellow-400/20 p-4">
        <h2 className="uppercase text-sm tracking-widest mb-2">Recent Admin Actions</h2>
        <table className="w-full text-xs">
          <thead className="text-yellow-400/80">
            <tr>
              <th className="text-left p-2">When</th>
              <th className="text-left p-2">Action</th>
              <th className="text-left p-2">Target</th>
            </tr>
          </thead>
          <tbody>
            {audit.map((a)=>(
              <tr key={a._id} className="border-t border-yellow-400/10">
                <td className="p-2">{new Date(a.createdAt).toLocaleString()}</td>
                <td className="p-2">{a.action}</td>
                <td className="p-2">{a.targetType}:{a.targetId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
