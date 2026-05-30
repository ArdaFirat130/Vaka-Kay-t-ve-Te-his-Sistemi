import React, { useState, useEffect } from 'react';
import { Mail, Building, Send, AlertCircle, CheckCircle2, UserCog, LogOut } from 'lucide-react';
import axios from 'axios';
import styles from './AdminDashboardPage.module.css';
import { useAppSelector, useAppDispatch } from '../../../hooks/reduxHooks';
import { logout } from '../../auth/authSlice';
import { FacilityModal } from '../components/FacilityModal/FacilityModal';

interface Facility {
  id: string;
  name: string;
  type: string;
  address: string;
}

interface StatsData {
  totalVictims: number;
  activeVictims: number;
  resolvedVictims: number;
  recentVictimsLast7Days: number;
  genderDistribution: Record<string, number>;
  healthStatusDistribution: Record<string, number>;
  ageGroupDistribution: Record<string, number>;
}

export const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const isSuperAdmin = role === 'ROLE_SUPER_ADMIN';

  const [email, setEmail] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [targetRole, setTargetRole] = useState('PERSONNEL');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Personeller İçin State
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    // Sadece Facility Admin (veya Super Admin eğer bir tesisi varsa) kendi tesisinin istatistiklerini görür
    if (!isSuperAdmin || (isSuperAdmin && false)) { 
      fetchStats();
    }
    if (isSuperAdmin) {
      fetchFacilities();
    }
    // Personelleri her iki yönetici de kendi yetkisi çerçevesinde çeker
    fetchUsers();
  }, [isSuperAdmin]);

  const fetchFacilities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/facilities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFacilities(response.data.payload || []);
      if (response.data.payload && response.data.payload.length > 0) {
        setFacilityId(response.data.payload[0].id);
      }
    } catch (error) {
      console.error('Tesisler yüklenirken hata:', error);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.payload || []);
    } catch (error) {
      console.error('Personeller yüklenirken hata:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/statistics/facility/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.payload);
    } catch (error) {
      console.error('Stats fetch error:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const token = localStorage.getItem('token');
      
      const payload: any = { email, targetRole: isSuperAdmin ? targetRole : 'PERSONNEL' };
      if (isSuperAdmin) {
        payload.facilityId = facilityId;
      }
      
      const response = await axios.post(
        '/api/v1/invitations',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setStatus({ type: 'success', message: response.data || 'Davetiye başarıyla gönderildi.' });
      setEmail('');
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.errors?.message || 'Davetiye gönderilirken bir hata oluştu.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderProgressBar = (label: string, count: number, total: number, color: string) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
      <div className={styles.barGroup} key={label}>
        <div className={styles.barLabelContainer}>
          <span>{label}</span>
          <span>{count} ({percentage}%)</span>
        </div>
        <div className={styles.barWrapper}>
          <div className={styles.barFill} style={{ width: `${percentage}%`, backgroundColor: color }} />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.dashboardCard}>
        <div className={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <div>
              <h2 className={styles.title}>Yönetici Paneli</h2>
              <p className={styles.subtitle}>
                Tesisinizin genel durumunu takip edin ve personellerinizi yönetin.
              </p>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn} title="Çıkış Yap">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {statsLoading && <div className={styles.spinner} style={{ borderColor: 'blue', margin: '0 auto 2rem auto' }} />}
          
          {stats && (
            <div className={styles.statsSection}>
              <h3 className={styles.statsSectionTitle}>Tesis Vaka İstatistikleri</h3>
              
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statCardTitle}>Toplam Vaka</span>
                  <span className={styles.statCardValue}>{stats.totalVictims}</span>
                  <span className={styles.statCardSubtitle}>Sisteme kayıtlı tüm vakalar</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statCardTitle}>Aktif Vakalar</span>
                  <span className={styles.statCardValue} style={{ color: '#ef4444' }}>{stats.activeVictims}</span>
                  <span className={styles.statCardSubtitle} style={{ color: '#ef4444' }}>Yakını henüz bulunamayanlar</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statCardTitle}>Sonuçlanan Vakalar</span>
                  <span className={styles.statCardValue} style={{ color: '#10b981' }}>{stats.resolvedVictims}</span>
                  <span className={styles.statCardSubtitle}>Yakınına ulaşılanlar</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statCardTitle}>Son 7 Gün</span>
                  <span className={styles.statCardValue} style={{ color: '#3b82f6' }}>+{stats.recentVictimsLast7Days}</span>
                  <span className={styles.statCardSubtitle} style={{ color: '#3b82f6' }}>Yeni kayıtlar</span>
                </div>
              </div>

              <div className={styles.barsGrid}>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#475569', marginBottom: '1rem' }}>Cinsiyet Dağılımı</h4>
                  {renderProgressBar('Erkek', stats.genderDistribution['MALE'] || 0, stats.totalVictims, '#3b82f6')}
                  {renderProgressBar('Kadın', stats.genderDistribution['FEMALE'] || 0, stats.totalVictims, '#ec4899')}
                  {renderProgressBar('Bilinmiyor', stats.genderDistribution['UNKNOWN'] || 0, stats.totalVictims, '#94a3b8')}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#475569', marginBottom: '1rem' }}>Sağlık Durumu</h4>
                  {renderProgressBar('Sağlıklı / Stabil', stats.healthStatusDistribution['STABLE'] || 0, stats.totalVictims, '#10b981')}
                  {renderProgressBar('Yaralı (Ciddi)', stats.healthStatusDistribution['SERIOUS'] || 0, stats.totalVictims, '#eab308')}
                  {renderProgressBar('Ağır Yaralı (Kritik)', stats.healthStatusDistribution['CRITICAL'] || 0, stats.totalVictims, '#ef4444')}
                  {renderProgressBar('Vefat Etmiş', stats.healthStatusDistribution['DECEASED'] || 0, stats.totalVictims, '#1e293b')}
                  {renderProgressBar('Bilinmiyor', stats.healthStatusDistribution['UNKNOWN'] || 0, stats.totalVictims, '#94a3b8')}
                </div>
              </div>
              
              <div className={styles.divider} />
            </div>
          )}

          {isSuperAdmin && (
            <div className={styles.statsSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className={styles.statsSectionTitle} style={{ margin: 0 }}>Sistemdeki Tesisler</h3>
                <button 
                  type="button"
                  onClick={() => { setSelectedFacility(null); setIsFacilityModalOpen(true); }}
                  className={styles.submitBtn}
                  style={{ width: 'auto', padding: '0.5rem 1rem', margin: 0 }}
                >
                  Yeni Tesis Ekle
                </button>
              </div>
              
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Tesis Adı</th>
                      <th>Tesis Türü</th>
                      <th>Adres</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilities.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>Sistemde henüz tesis bulunmuyor.</td></tr>
                    ) : (
                      facilities.map(fac => (
                        <tr key={fac.id}>
                          <td><strong>{fac.name}</strong></td>
                          <td>
                            {fac.type === 'HOSPITAL' ? 'Hastane' : fac.type === 'FIELD_STATION' ? 'Sahra Çadırı / Toplanma Alanı' : 'Triyaj Noktası'}
                          </td>
                          <td>{fac.address || '-'}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => { setSelectedFacility(fac); setIsFacilityModalOpen(true); }}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
                            >
                              Düzenle
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className={styles.divider} />
            </div>
          )}

          <div className={styles.statsSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className={styles.statsSectionTitle} style={{ margin: 0 }}>Sistemdeki Personeller</h3>
              <button 
                type="button"
                onClick={fetchUsers}
                className={styles.submitBtn}
                style={{ width: 'auto', padding: '0.5rem 1rem', margin: 0, backgroundColor: '#10b981' }}
              >
                Yenile
              </button>
            </div>
            
            <div className={styles.tableContainer}>
              {usersLoading ? (
                <div className={styles.spinner} style={{ borderColor: 'blue', margin: '2rem auto' }} />
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>E-posta Adresi</th>
                      <th>Rol</th>
                      <th>Görev Yaptığı Tesis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>Sistemde personel bulunmuyor.</td></tr>
                    ) : (
                      users.map((user: any) => (
                        <tr key={user.id}>
                          <td><strong>{user.email}</strong></td>
                          <td>
                            {user.role === 'SUPER_ADMIN' ? 'Sistem Yöneticisi' : 
                             user.role === 'FACILITY_ADMIN' ? 'Hastane Yöneticisi' : 'Personel'}
                          </td>
                          <td>{user.facility ? user.facility.name : '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className={styles.divider} />
          </div>

          <h3 className={styles.statsSectionTitle} style={{ marginTop: '1rem' }}>Personel Daveti Oluştur</h3>
          
          {status && (
            <div className={status.type === 'success' ? styles.alertSuccess : styles.alertError}>
              {status.type === 'success' ? (
                <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
              )}
              <p className={styles.alertText}>{status.message}</p>
            </div>
          )}

          <form onSubmit={handleInvite} className={styles.form}>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>E-posta Adresi</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="personel@hastane.gov.tr"
                />
              </div>
            </div>

            {isSuperAdmin && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Görev Yapacağı Tesis</label>
                  <div className={styles.inputWrapper}>
                    <Building size={18} className={styles.inputIcon} />
                    <select
                      required
                      value={facilityId}
                      onChange={(e) => setFacilityId(e.target.value)}
                      className={`${styles.input} ${styles.select}`}
                    >
                      {facilities.map(facility => (
                        <option key={facility.id} value={facility.id}>
                          {facility.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Davet Edilecek Rol</label>
                  <div className={styles.inputWrapper}>
                    <UserCog size={18} className={styles.inputIcon} />
                    <select
                      required
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className={`${styles.input} ${styles.select}`}
                    >
                      <option value="PERSONNEL">Personel</option>
                      <option value="FACILITY_ADMIN">Hastane Yöneticisi</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={styles.submitBtn}
              >
                {isLoading ? (
                  <div className={styles.spinner} />
                ) : (
                  <>
                    <Send size={18} />
                    <span>Davetiye Gönder</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      <FacilityModal
        isOpen={isFacilityModalOpen}
        onClose={() => setIsFacilityModalOpen(false)}
        onSave={() => {
          setIsFacilityModalOpen(false);
          fetchFacilities(); // Listeyi yenile
        }}
        facility={selectedFacility}
      />
    </div>
  );
};
