import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get('/users');
        if (!mounted) return;
        setUsers(res?.data || res || []);
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const items = users.filter((u) =>
    [u.name, u.email, u.username].some((f) =>
      String(f || '').toLowerCase().includes(q.toLowerCase()),
    ),
  );

  const promote = async (id) => {
    await api.post(`/admin/users/${id}/promote`);
    setUsers((arr) => arr.map((u) => (u._id === id ? { ...u, isAdmin: true } : u)));
  };
  const demote = async (id) => {
    await api.post(`/admin/users/${id}/demote`);
    setUsers((arr) => arr.map((u) => (u._id === id ? { ...u, isAdmin: false } : u)));
  };
  const verify = async (id) => {
    await api.post(`/admin/users/${id}/verify`);
    setUsers((arr) => arr.map((u) => (u._id === id ? { ...u, isVerified: true } : u)));
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search users…"
          className="bg-black border border-yellow-400/30 px-2 py-1 text-sm text-yellow-200 w-64"
        />
      </div>
      <table className="w-full text-sm">
        <thead className="text-yellow-400/80">
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Username</th>
            <th className="text-left p-2">Verified</th>
            <th className="text-left p-2">Admin</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u._id} className="border-t border-yellow-400/10">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.isVerified ? 'Yes' : 'No'}</td>
              <td className="p-2">{u.isAdmin ? 'Yes' : 'No'}</td>
              <td className="p-2 flex gap-2">
                {!u.isVerified && (
                  <button className="px-2 py-1 bg-yellow-400 text-black" onClick={() => verify(u._id)}>
                    Verify
                  </button>
                )}
                {u.isAdmin ? (
                  <button className="px-2 py-1 bg-yellow-400/20 border border-yellow-400/50" onClick={() => demote(u._id)}>
                    Demote
                  </button>
                ) : (
                  <button className="px-2 py-1 bg-yellow-400 text-black" onClick={() => promote(u._id)}>
                    Promote
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

