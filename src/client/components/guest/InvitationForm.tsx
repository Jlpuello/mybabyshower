import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Loading } from '../ui/Loading';
import { Toast } from '../ui/Toast';

interface InvitationFormProps {
  onSuccess: (guestData: any) => void;
}

export const InvitationForm = ({ onSuccess }: InvitationFormProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sanitizeInput = (value: string): string => {
    return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('code') || sessionStorage.getItem('invitation_code');
      if (codeParam) {
        setCode(sanitizeInput(codeParam));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedCode = sanitizeInput(code);
    
    if (sanitizedCode.length < 3 || sanitizedCode.length > 20) {
      setError('El código debe tener entre 3 y 20 caracteres');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/invitations/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: sanitizedCode }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Código inválido');
      }

      const data = await response.json();
      onSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al validar código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-serif font-bold text-textPrimary mb-6 text-center">
        Ingresa tu código de invitación
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Código de invitación"
          value={code}
          onChange={(e) => setCode(sanitizeInput(e.target.value))}
          placeholder="BS-XXXX"
          error={error ?? undefined}
          disabled={loading}
          autoFocus
          maxLength={20}
        />
        <Button type="submit" fullWidth disabled={loading || !code.trim()}>
          {loading ? <Loading size="sm" /> : 'Validar'}
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
