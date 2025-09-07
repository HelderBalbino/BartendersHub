import { useEffect, useState } from 'react';
import api from '../../services/api';

function toCSV(rows){
  if(!rows?.length) return '';
  const headers=['id','name','isApproved','isFeatured'];
  const lines=[headers.join(',')];
  for(const c of rows){
    const vals=[c._id,c.name,c.isApproved,c.isFeatured].map(v=>`"${String(v??'').replace(/"/g,'""')}"`);
    lines.push(vals.join(','));
  }
  return lines.join('\n');
}

export default function AdminCocktails() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sel, setSel] = useState({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get('/cocktails?limit=100&fields=name,isApproved,isFeatured,createdBy');
        if (!mounted) return;
        const data = Array.isArray(res?.data) ? res.data : res;
        setRows(data);
      } catch (e) { setError(e.message); }
      finally { if (mounted) setLoading(false); }
    }
    load();
    return () => (mounted = false);
  }, []);

  const approve = async (id) => {
    await api.post(`/admin/cocktails/${id}/approve`);
    setRows((arr) => arr.map((c) => (c._id === id ? { ...c, isApproved: true } : c)));
  };
  const feature = async (id) => {
    await api.post(`/admin/cocktails/${id}/feature`);
    setRows((arr) => arr.map((c) => (c._id === id ? { ...c, isFeatured: true } : c)));
  };
  const unfeature = async (id) => {
    await api.post(`/admin/cocktails/${id}/unfeature`);
    setRows((arr) => arr.map((c) => (c._id === id ? { ...c, isFeatured: false } : c)));
  };

  const items = rows.filter((c) => String(c.name || '').toLowerCase().includes(q.toLowerCase()));
  const allSelected = items.length && items.every((c)=>sel[c._id]);
  const toggleAll=()=>{ if(allSelected) setSel({}); else { const n={}; items.forEach(c=>n[c._id]=true); setSel(n);} };
  const bulk = async (op) => {
    const ids = Object.keys(sel).filter((k)=>sel[k]);
    if(!ids.length) return alert('Select at least one');
    await api.post('/admin/cocktails/bulk', { ids, op });
    if(op==='approve') setRows(arr=>arr.map(c=> sel[c._id]?{...c,isApproved:true}:c));
    if(op==='feature') setRows(arr=>arr.map(c=> sel[c._id]?{...c,isFeatured:true}:c));
    if(op==='unfeature') setRows(arr=>arr.map(c=> sel[c._id]?{...c,isFeatured:false}:c));
    setSel({});
  };
  const exportCSV=()=>{ const chosen=items.filter(c=>sel[c._id]); const csv=toCSV(chosen.length?chosen:items); const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='cocktails.csv'; a.click(); URL.revokeObjectURL(url); };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <div className="mb-3 flex gap-2 items-center">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cocktails…" className="bg-black border border-yellow-400/30 px-2 py-1 text-sm text-yellow-200 w-64" />
        <button className="px-2 py-1 bg-yellow-400 text-black" onClick={()=>bulk('approve')}>Bulk Approve</button>
        <button className="px-2 py-1 bg-yellow-400 text-black" onClick={()=>bulk('feature')}>Bulk Feature</button>
        <button className="px-2 py-1 bg-yellow-400/20 border border-yellow-400/50" onClick={()=>bulk('unfeature')}>Bulk Unfeature</button>
        <button className="px-2 py-1 bg-yellow-400 text-black" onClick={exportCSV}>Export CSV</button>
      </div>
      <table className="w-full text-sm">
        <thead className="text-yellow-400/80">
          <tr>
            <th className="p-2"><input type="checkbox" checked={!!allSelected} onChange={toggleAll} /></th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Approved</th>
            <th className="text-left p-2">Featured</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c._id} className="border-t border-yellow-400/10">
              <td className="p-2"><input type="checkbox" checked={!!sel[c._id]} onChange={(e)=> setSel((s)=>({...s,[c._id]:e.target.checked}))}/></td>
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.isApproved ? 'Yes' : 'No'}</td>
              <td className="p-2">{c.isFeatured ? 'Yes' : 'No'}</td>
              <td className="p-2 flex gap-2">
                {!c.isApproved && (
                  <button className="px-2 py-1 bg-yellow-400 text-black" onClick={() => approve(c._id)}>Approve</button>
                )}
                {c.isFeatured ? (
                  <button className="px-2 py-1 bg-yellow-400/20 border border-yellow-400/50" onClick={() => unfeature(c._id)}>Unfeature</button>
                ) : (
                  <button className="px-2 py-1 bg-yellow-400 text-black" onClick={() => feature(c._id)}>Feature</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
