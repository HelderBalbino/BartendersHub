import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/cocktails', label: 'Cocktails' },
  { to: '/admin/moderation', label: 'Moderation' },
  { to: '/admin/system', label: 'System' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-black text-yellow-300">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl tracking-widest uppercase mb-4">Admin Panel</h1>
        <div className="flex gap-3 border-b border-yellow-400/30 mb-6">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `px-3 py-2 uppercase text-xs tracking-widest border-b-2 ${
                  isActive ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-yellow-300/70 hover:text-yellow-300'
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </div>
        <div className="bg-neutral-900/50 border border-yellow-400/20 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

