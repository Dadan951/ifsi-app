import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function PaywallGate({ requiredPlan = 'pro', feature = 'cette fonctionnalité' }) {
  const navigate = useNavigate();
  const isPremium = requiredPlan === 'premium';

  const gradient = isPremium
    ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
    : 'linear-gradient(135deg, #2563eb, #0891b2)';

  const glow = isPremium ? 'rgba(124,58,237,0.2)' : 'rgba(37,99,235,0.2)';
  const label = isPremium ? 'Premium' : 'Pro';
  const price = isPremium ? '19,99€' : '9,99€';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Lock icon */}
      <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5 shadow-lg"
        style={{ background: gradient, boxShadow: `0 12px 40px ${glow}` }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Fonctionnalité réservée au plan <span style={{ backgroundImage: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{label}</span>
      </h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {feature} est disponible à partir du plan {label}. Passe à {label} pour dès {price}/mois et débloque toutes les fonctionnalités.
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        <motion.button
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard/subscription')}
          className="px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-lg"
          style={{ background: gradient, boxShadow: `0 8px 24px ${glow}` }}
        >
          Passer au plan {label} — {price}/mois
        </motion.button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 rounded-2xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
        >
          Retour au tableau de bord
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-4">Sans engagement · Annulez à tout moment</p>
    </motion.div>
  );
}
