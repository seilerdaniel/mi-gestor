import { NavLink, Route, Routes } from 'react-router-dom';
import ComprasPage from './compras/ComprasPage';
import FinanzasPage from './finanzas/FinanzasPage';
import HomePage from './home/HomePage';

const enlaces = [
  { to: '/', label: 'Inicio' },
  { to: '/finanzas', label: 'Finanzas' },
  { to: '/compras', label: 'Compras' },
];

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
          <span className="text-lg font-semibold">Mi Gestor</span>
          <div className="flex gap-4 text-sm">
            {enlaces.map((enlace) => (
              <NavLink
                key={enlace.to}
                to={enlace.to}
                className={({ isActive }) =>
                  isActive
                    ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }
              >
                {enlace.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/finanzas" element={<FinanzasPage />} />
          <Route path="/compras" element={<ComprasPage />} />
        </Routes>
      </main>
    </div>
  );
}
