import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import axios from 'axios';
import styles from './LoginPage.module.css';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Geçersiz veya eksik sıfırlama bağlantısı.');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor. Lütfen kontrol edin.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:8080/api/v1/auth/reset-password', { 
        token, 
        newPassword: password 
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.errors?.message || 'Şifre sıfırlanırken bir hata oluştu. Bağlantının süresi dolmuş olabilir.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.bgDecoration1}></div>
      <div className={styles.bgDecoration2}></div>

      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <ShieldAlert size={32} className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>Yeni Şifre Belirle</h1>
          <p className={styles.subtitle}>Hesabınızın güvenliğini sağlamak için lütfen güçlü bir şifre girin.</p>
        </div>

        <div className={styles.formContainer}>
          {error && <div className={styles.errorAlert}>{error}</div>}
          
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', padding: '1rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={48} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem', fontWeight: 600 }}>Tebrikler!</h3>
              <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Şifreniz başarıyla sıfırlandı. Artık yeni şifrenizle sisteme giriş yapabilirsiniz.
              </p>
              <Button type="button" onClick={() => navigate('/login')} fullWidth size="lg">
                Giriş Ekranına Git
              </Button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                label="Yeni Şifre"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <Input
                label="Yeni Şifre (Tekrar)"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              
              <Button type="submit" fullWidth size="lg" className={styles.submitBtn} isLoading={isLoading}>
                Şifremi Güncelle
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
