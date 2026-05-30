import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import styles from './AcceptInvitePage.module.css';

export const AcceptInvitePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'valid' | 'invalid'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('invalid');
        setErrorMessage('Geçersiz veya eksik davet bağlantısı.');
        return;
      }

      try {
        await axios.get(`/api/v1/invitations/verify/${token}`);
        setStatus('valid');
      } catch (error: any) {
        setStatus('invalid');
        setErrorMessage(error.response?.data?.errors?.message || 'Bu davet geçersiz, süresi dolmuş veya daha önce kullanılmış.');
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setErrorMessage('Şifreler eşleşmiyor!');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await axios.post('/api/v1/invitations/accept', {
        token,
        password
      });
      
      // Clear any existing session to force the user to login with their new credentials
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      setSuccess(true);
      setTimeout(() => {
        // We use window.location.href instead of navigate to ensure a full state reset
        window.location.href = '/login';
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.errors?.message || 'Şifre belirlenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Shield size={32} className={styles.icon} />
          </div>
          <h2 className={styles.title}>Hesabınızı Aktifleştirin</h2>
          <p className={styles.subtitle}>
            Afet Vaka Kayıt Sistemi'ne hoş geldiniz. Şifrenizi belirleyerek hesabınızı kullanmaya başlayabilirsiniz.
          </p>
        </div>

        <div className={styles.content}>
          {status === 'verifying' && (
            <div className={styles.statusContainer}>
              <div className={styles.spinner} />
              <p className={styles.statusText}>Davetiniz doğrulanıyor...</p>
            </div>
          )}

          {status === 'invalid' && (
            <div className={styles.statusContainer}>
              <div className={`${styles.statusIcon} ${styles.error}`}>
                <AlertCircle size={24} />
              </div>
              <h3 className={styles.statusTitle}>Geçersiz Davet</h3>
              <p className={styles.statusText}>{errorMessage}</p>
              <button
                onClick={() => navigate('/login')}
                className={styles.linkBtn}
              >
                Giriş sayfasına dön
              </button>
            </div>
          )}

          {status === 'valid' && success && (
            <div className={styles.statusContainer}>
              <div className={`${styles.statusIcon} ${styles.success}`}>
                <CheckCircle2 size={24} />
              </div>
              <h3 className={styles.statusTitle}>Başarılı!</h3>
              <p className={styles.statusText}>Şifreniz başarıyla belirlendi. Giriş sayfasına yönlendiriliyorsunuz...</p>
            </div>
          )}

          {status === 'valid' && !success && (
            <form onSubmit={handleSubmit} className={styles.form}>
              {errorMessage && (
                <div className={styles.alertError}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p className={styles.alertText}>{errorMessage}</p>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>Yeni Şifre</label>
                <div className={styles.inputWrapper}>
                  <KeyRound size={18} className={styles.inputIcon} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Şifre (Tekrar)</label>
                <div className={styles.inputWrapper}>
                  <KeyRound size={18} className={styles.inputIcon} />
                  <input
                    type="password"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className={styles.input}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={styles.submitBtn}
              >
                {isLoading ? 'Kaydediliyor...' : 'Şifreyi Belirle ve Tamamla'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
