import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Loading } from '../ui/Loading';
import { Toast } from '../ui/Toast';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sanitizeEmail = (value: string): string => {
    return value.trim().toLowerCase();
  };

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedEmail = sanitizeEmail(email);
    
    if (!validateEmail(sanitizedEmail)) {
      setError('Email inválido');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sanitizedEmail, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Credenciales inválidas');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-serif font-bold text-textPrimary mb-6 text-center">
        Acceso Administrativo
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
          placeholder="admin@ejemplo.com"
          error={error ?? undefined}
          disabled={loading}
          autoFocus
        />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
          minLength={6}
        />
        <Button type="submit" fullWidth disabled={loading || !email.trim() || !password.trim()}>
          {loading ? <Loading size="sm" /> : 'Iniciar sesión'}
        </Button>
      </form>
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
};
