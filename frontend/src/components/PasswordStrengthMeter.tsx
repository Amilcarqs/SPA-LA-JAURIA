import { useMemo } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const score = useMemo(() => {
    let value = 0;
    if (password.length >= 8) value += 1;
    if (/[A-Z]/.test(password)) value += 1;
    if (/[a-z]/.test(password)) value += 1;
    if (/\d/.test(password)) value += 1;
    if (/[^A-Za-z0-9]/.test(password)) value += 1;
    return value;
  }, [password]);

  const labels = ['Muy débil', 'Débil', 'Media', 'Buena', 'Fuerte'];
  const colors = ['#dc2626', '#f59e0b', '#eab308', '#3b82f6', '#16a34a'];

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ height: '8px', borderRadius: '999px', background: '#e5e7eb', overflow: 'hidden' }}>
        <div
          style={{
            width: `${(score / 5) * 100}%`,
            height: '100%',
            background: colors[Math.min(score, 4)],
            transition: 'width 0.2s ease',
          }}
        />
      </div>
      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
        Fuerza: {labels[Math.min(score, 4)]}
      </p>
    </div>
  );
}
