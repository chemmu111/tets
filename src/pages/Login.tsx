import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(username, password);
    if (success) {
      navigate('/admin');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="card-bg backdrop-blur-sm rounded-xl p-8 w-full max-w-md card-border"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 dark:bg-purple-600/20 light:bg-purple-100 rounded-full mb-4"
          >
            <Lock className="text-purple-400 dark:text-purple-400 light:text-purple-600" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Login</h1>
          <p className="text-secondary">Access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 input-bg input-border rounded-lg input-focus transition-all duration-300 text-primary placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 input-bg input-border rounded-lg input-focus transition-all duration-300 text-primary placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        <div className="mt-6 p-4 bg-purple-600/10 dark:bg-purple-600/10 light:bg-purple-50 border border-purple-500/20 dark:border-purple-500/20 light:border-purple-200 rounded-lg">
          <p className="text-sm text-accent mb-2">Demo Credentials:</p>
          <p className="text-xs text-secondary">Username: admin</p>
          <p className="text-xs text-secondary">Password: admin123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;