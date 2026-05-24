import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, ShieldAlert, Phone, Mail, Lock, UserPlus } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { loginPersonnel, sendOtp, verifyOtp, resetOtpState, resetError } from '../authSlice';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, otpSent, isAuthenticated, role } = useAppSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState<'personnel' | 'relative'>('personnel');

  const { register: regPersonnel, handleSubmit: submitPersonnel, formState: { errors: errPersonnel } } = useForm();
  const { register: regOtp, handleSubmit: submitOtp, formState: { errors: errOtp }, getValues: getOtpValues } = useForm();
  const { register: regVerify, handleSubmit: submitVerify, formState: { errors: errVerify } } = useForm();

  // Redirect on successful login
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_FACILITY_ADMIN') navigate('/admin/dashboard');
      else if (role === 'ROLE_PERSONNEL') navigate('/register-victim');
      else if (role === 'ROLE_RELATIVE') navigate('/search');
    }
  }, [isAuthenticated, role, navigate]);

  // Clear errors when switching tabs
  useEffect(() => {
    dispatch(resetError());
  }, [activeTab, dispatch]);

  const onPersonnelLogin = (data: any) => {
    dispatch(loginPersonnel({ email: data.email, password: data.password }));
  };

  const onSendOtp = (data: any) => {
    dispatch(sendOtp({
      nationalId: data.nationalId,
      phoneNumber: data.phone,
      fullName: data.fullName,
      relationship: "RELATIVE"
    }));
  };

  const onVerifyOtp = (data: any) => {
    const otpData = getOtpValues(); // Get phone and nationalId from previous form
    dispatch(verifyOtp({
      nationalId: otpData.nationalId,
      phoneNumber: otpData.phone,
      otpCode: data.otpCode
    }));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Decorative background elements for a premium feel */}
      <div className={styles.bgDecoration1}></div>
      <div className={styles.bgDecoration2}></div>

      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <ShieldAlert size={32} className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>Vaka Kayıt Sistemi</h1>
          <p className={styles.subtitle}>Sistem Yöneticisi (Admin) ve Personel girişleri "Yetkili Girişi" sekmesinden yapılmaktadır.</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'personnel' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('personnel')}
          >
            <User size={18} />
            <span>Yetkili Girişi</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'relative' ? styles.activeTab : ''}`}
            onClick={() => {
              setActiveTab('relative');
              dispatch(resetOtpState()); // Reset OTP state when switching
            }}
          >
            <UserPlus size={18} />
            <span>Kayıp Yakını</span>
          </button>
        </div>

        <div className={styles.formContainer}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          {activeTab === 'personnel' && (
            <form className={styles.form} onSubmit={submitPersonnel(onPersonnelLogin)}>
              <Input
                label="E-Posta Adresi"
                type="email"
                placeholder="ornek@hastane.com"
                leftIcon={<Mail size={18} />}
                fullWidth
                {...regPersonnel('email', { required: 'E-Posta zorunludur' })}
                error={errPersonnel.email?.message as string}
              />
              <Input
                label="Şifre"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                fullWidth
                {...regPersonnel('password', { required: 'Şifre zorunludur' })}
                error={errPersonnel.password?.message as string}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
                  Şifremi Unuttum?
                </Link>
              </div>
              <Button type="submit" fullWidth size="lg" className={styles.submitBtn} isLoading={isLoading}>
                Sisteme Giriş Yap
              </Button>
            </form>
          )}

          {activeTab === 'relative' && !otpSent && (
            <form className={styles.form} onSubmit={submitOtp(onSendOtp)}>
              <div className={styles.infoAlert}>
                Girdiğiniz bilgiler doğrulandıktan sonra telefonunuza tek kullanımlık SMS kodu gönderilecektir.
              </div>
              <Input
                label="T.C. Kimlik No"
                type="text"
                placeholder="11 Haneli T.C. Kimlik Numaranız"
                maxLength={11}
                leftIcon={<User size={18} />}
                fullWidth
                {...regOtp('nationalId', { required: 'T.C. Kimlik zorunludur', minLength: {value: 11, message: '11 hane olmalıdır'} })}
                error={errOtp.nationalId?.message as string}
              />
              <Input
                label="Telefon Numarası"
                type="tel"
                placeholder="05XX XXX XX XX"
                leftIcon={<Phone size={18} />}
                fullWidth
                {...regOtp('phone', { required: 'Telefon zorunludur' })}
                error={errOtp.phone?.message as string}
              />
              <Input
                label="Adınız Soyadınız"
                type="text"
                placeholder="Tam Adınız"
                fullWidth
                {...regOtp('fullName', { required: 'Ad Soyad zorunludur' })}
                error={errOtp.fullName?.message as string}
              />
              <Button type="submit" fullWidth size="lg" className={styles.submitBtn} isLoading={isLoading}>
                Doğrulama Kodu Gönder
              </Button>
            </form>
          )}

          {activeTab === 'relative' && otpSent && (
            <form className={styles.form} onSubmit={submitVerify(onVerifyOtp)}>
              <div className={styles.successAlert}>
                Telefonunuza 6 haneli doğrulama kodu gönderildi. Kodun geçerlilik süresi 3 dakikadır.
              </div>
              <Input
                label="SMS Doğrulama Kodu"
                type="text"
                placeholder="XXXXXX"
                maxLength={6}
                leftIcon={<Lock size={18} />}
                fullWidth
                style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.25rem' }}
                {...regVerify('otpCode', { required: 'Kod zorunludur', minLength: {value: 6, message: '6 hane olmalıdır'} })}
                error={errVerify.otpCode?.message as string}
              />
              <Button type="submit" fullWidth size="lg" className={styles.submitBtn} isLoading={isLoading}>
                Kodu Doğrula ve Giriş Yap
              </Button>
              <button 
                type="button" 
                className={styles.backBtn}
                onClick={() => dispatch(resetOtpState())}
              >
                Bilgileri Düzenle
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
