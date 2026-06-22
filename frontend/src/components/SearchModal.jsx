import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL, useAuth } from '../context/AuthContext';

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const QuizIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const CardIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="4" width="14" height="10" rx="2"/><rect x="8" y="10" width="14" height="10" rx="2"/>
  </svg>
);
const CoursIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const FicheIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>
);

const TYPE_META = {
  quiz:      { label: 'Quiz',            Icon: QuizIcon,  color: 'text-blue-500',   bg: 'bg-blue-50',   dot: 'bg-blue-400'   },
  flashcard: { label: 'Flashcards',      Icon: CardIcon,  color: 'text-purple-500', bg: 'bg-purple-50', dot: 'bg-purple-400' },
  cours:     { label: 'Cours',           Icon: CoursIcon, color: 'text-emerald-600',bg: 'bg-emerald-50',dot: 'bg-emerald-400'},
  fiche:     { label: 'Fiches de révision', Icon: FicheIcon, color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
};

/* ─── helpers ────────────────────────────────────────────────────────────── */
function highlight(text, q) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-yellow-200 text-yellow-900 rounded-sm not-italic">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

const MAX_PER_TYPE = 5;

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function SearchModal({ open, onClose }) {
  const { token } = useAuth();
  const navigate  = useNavigate();
  const inputRef  = useRef(null);

  const [query,    setQuery]    = useState('');
  const [corpus,   setCorpus]   = useState(null); // null = not loaded yet
  const [loading,  setLoading]  = useState(false);
  const [active,   setActive]   = useState(0);    // keyboard-selected result index

  /* Load corpus once (cached for the session) */
  const load = useCallback(async () => {
    if (corpus || loading) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [qRes, fcRes, coursRes, ficheRes] = await Promise.allSettled([
        axios.get(`${API_URL}/quizzes`,           { headers }),
        axios.get(`${API_URL}/flashcards`,        { headers }),
        axios.get(`${API_URL}/lessons?type=cours`,{ headers }),
        axios.get(`${API_URL}/lessons?type=fiche`,{ headers }),
      ]);

      const quizzes    = qRes.status     === 'fulfilled' ? qRes.value.data     : [];
      const flashcards = fcRes.status    === 'fulfilled' ? fcRes.value.data    : [];
      const cours      = coursRes.status === 'fulfilled' ? coursRes.value.data : [];
      const fiches     = ficheRes.status === 'fulfilled' ? ficheRes.value.data : [];

      setCorpus([
        ...quizzes.map(q => ({
          id: q._id, type: 'quiz',
          title: q.title,
          sub: [q.category, q.chapter, q.semester].filter(Boolean).join(' · '),
          badge: q.difficulty,
          href: `/dashboard/quiz/${q._id}`,
        })),
        ...flashcards.map(f => ({
          id: f._id, type: 'flashcard',
          title: f.title,
          sub: [f.category, f.chapter, f.semester].filter(Boolean).join(' · '),
          href: '/dashboard/flashcards',
        })),
        ...cours.map(c => ({
          id: c._id, type: 'cours',
          title: c.title,
          sub: [c.semester, c.category].filter(Boolean).join(' · '),
          href: '/dashboard/cours',
        })),
        ...fiches.map(f => ({
          id: f._id, type: 'fiche',
          title: f.title,
          sub: [f.semester, f.category].filter(Boolean).join(' · '),
          href: '/dashboard/cours',
        })),
      ]);
    } finally {
      setLoading(false);
    }
  }, [corpus, loading, token]);

  useEffect(() => {
    if (open) {
      load();
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setActive(0);
    }
  }, [open]); // eslint-disable-line

  /* Filter */
  const results = (() => {
    if (!corpus || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    return corpus.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.sub.toLowerCase().includes(q)
    );
  })();

  /* Group */
  const grouped = (() => {
    const map = {};
    for (const r of results) {
      if (!map[r.type]) map[r.type] = [];
      if (map[r.type].length < MAX_PER_TYPE) map[r.type].push(r);
    }
    return Object.entries(map);
  })();

  /* Flat list for keyboard nav */
  const flat = grouped.flatMap(([, items]) => items);

  /* Keyboard navigation */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, flat.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
      if (e.key === 'Enter' && flat[active]) { go(flat[active]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, flat, active]); // eslint-disable-line

  useEffect(() => { setActive(0); }, [query]);

  function go(item) {
    navigate(item.href);
    onClose();
  }

  /* ── Render ── */
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed top-[12vh] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">

              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Quiz, flashcards, cours, fiches…"
                  className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                />
                {loading && (
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0"/>
                )}
                <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">Esc</kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {!query.trim() ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-slate-400">Tape pour rechercher dans tes cours, quiz et flashcards</p>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      {Object.values(TYPE_META).map(m => (
                        <div key={m.label} className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg ${m.bg} ${m.color}`}>
                          <m.Icon/>{m.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : results.length === 0 && !loading ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-slate-500 font-medium">Aucun résultat pour "{query}"</p>
                    <p className="text-xs text-slate-400 mt-1">Essaie avec un autre mot-clé</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {grouped.map(([type, items]) => {
                      const meta = TYPE_META[type];
                      return (
                        <div key={type}>
                          {/* Type header */}
                          <div className={`flex items-center gap-2 px-4 py-2 ${meta.color}`}>
                            <meta.Icon/>
                            <span className="text-[11px] font-bold uppercase tracking-wider">{meta.label}</span>
                            <span className="text-[10px] opacity-60">— {items.length} résultat{items.length > 1 ? 's' : ''}</span>
                          </div>

                          {/* Items */}
                          {items.map((item) => {
                            const idx    = flat.indexOf(item);
                            const isActive = idx === active;
                            return (
                              <button
                                key={item.id}
                                onMouseEnter={() => setActive(idx)}
                                onClick={() => go(item)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isActive ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                              >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}>
                                  <meta.Icon/>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-800 truncate">
                                    {highlight(item.title, query)}
                                  </p>
                                  {item.sub && (
                                    <p className="text-xs text-slate-400 truncate">{highlight(item.sub, query)}</p>
                                  )}
                                </div>
                                {item.badge && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                    item.badge === 'easy'   ? 'bg-emerald-100 text-emerald-700' :
                                    item.badge === 'hard'   ? 'bg-red-100 text-red-700' :
                                                              'bg-amber-100 text-amber-700'
                                  }`}>
                                    {item.badge === 'easy' ? 'Facile' : item.badge === 'hard' ? 'Difficile' : 'Moyen'}
                                  </span>
                                )}
                                {isActive && (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
                                    <polyline points="9 18 15 12 9 6"/>
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}

                    {/* Total count */}
                    {results.length > 0 && (
                      <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {results.length} résultat{results.length > 1 ? 's' : ''} au total
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <kbd className="border border-slate-200 rounded px-1">↑↓</kbd> naviguer
                          <kbd className="border border-slate-200 rounded px-1">↵</kbd> ouvrir
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
