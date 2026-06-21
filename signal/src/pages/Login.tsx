import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email] = useState('operador@demo.signal');
  const [password] = useState('demo-signal-2026');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 650);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-amber-600/5 blur-[80px] pointer-events-none" />

      {/* Back link */}
      <motion.a
        href="https://raniere.dev"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors text-sm font-medium group"
      >
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Voltar ao portfólio
      </motion.a>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo area */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-4 shadow-lg shadow-amber-500/25"
          >
            <Zap size={32} className="text-slate-950" fill="currentColor" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white tracking-tight"
          >
            Signal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-slate-400 text-sm mt-1"
          >
            Plataforma Omnichannel
          </motion.p>
        </div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-black/40"
        >
          <h2 className="text-white font-semibold text-lg mb-1">Acesso ao painel</h2>
          <p className="text-slate-500 text-sm mb-6">Credenciais já preenchidas para demonstração</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  readOnly
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-70 text-slate-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-amber-500/25"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar na plataforma</span>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-slate-600 text-xs mt-6"
        >
          Ambiente de demonstração · dados fictícios · credenciais já preenchidas
        </motion.p>
      </motion.div>
    </div>
  );
};
