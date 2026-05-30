import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import axios from 'axios';
import styles from './LoginPage.module.css'; // Reusing existing premium styles

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Lütfen e-posta adresinizi giriniz.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await axios.post('/api/v1/auth/forgot-password', { email });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.errors?.message || 'Şifre sıfırlama işlemi başarısız oldu.');
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
          <h1 className={styles.title}>Şifremi Unuttum</h1>
          <p className={styles.subtitle}>Sisteme kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</p>
        </div>

        <div className={styles.formContainer}>
          {error && <div className={styles.errorAlert}>{error}</div>}
          
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', padding: '1rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={48} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem', fontWeight: 600 }}>E-posta Gönderildi!</h3>
              <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                <b>{email}</b> adresine şifre sıfırlama talimatlarını içeren bir e-posta gönderdik. Lütfen gelen kutunuzu (ve spam/gereksiz klasörünü) kontrol edin.
              </p>
              <Button type="button" onClick={() => navigate('/login')} fullWidth size="lg">
                Giriş Sayfasına Dön
              </Button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                label="E-Posta Adresi"
                type="email"
                placeholder="ornek@hastane.com"
                leftIcon={<Mail size={18} />}
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Button type="submit" fullWidth size="lg" className={styles.submitBtn} isLoading={isLoading}>
                Sıfırlama Bağlantısı Gönder
              </Button>
              
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                  <ArrowLeft size={16} />
                  Giriş ekranına geri dön
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
