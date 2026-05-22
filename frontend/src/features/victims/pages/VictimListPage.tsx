import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './VictimListPage.module.css';
import { CheckCircle2, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';

interface Victim {
  id: string;
  caseNumber: string;
  gender: string;
  ageGroup: string;
  province: string;
  district: string;
  recordedAt: string;
}

export const VictimListPage: React.FC = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  const [victims, setVictims] = useState<Victim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchVictims();
  }, []);

  const fetchVictims = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/victims/facility/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVictims(response.data.payload || []);
    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', message: 'Vakalar yüklenirken bir hata oluştu.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (id: string, caseNumber: string) => {
    if (!window.confirm(`${caseNumber} numaralı vakayı "Sonuçlandı (Yakınına Ulaşıldı)" olarak işaretlemek istediğinize emin misiniz? Bu işlem vakayı listeden kaldıracaktır.`)) {
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/v1/victims/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: `${caseNumber} başarıyla sonuçlandırıldı.` });
      setVictims(prev => prev.filter(v => v.id !== id));
    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', message: 'Vaka sonuçlandırılırken bir hata oluştu.' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.dashboardCard}>
        <div className={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className={styles.title}>Tesisin Aktif Vakaları</h2>
              <p className={styles.subtitle}>
                Tesisiniz tarafından kaydedilen ve henüz yakınına ulaşılamamış vakalar aşağıda listelenmektedir. Yakınına ulaşılan vakaları sonuçlandırarak sistemden kaldırabilirsiniz.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/register-victim" style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: '500' }}>
                + Yeni Vaka Kaydı
              </Link>
              <button 
                onClick={() => dispatch(logout())}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {status && (
            <div className={status.type === 'success' ? styles.alertSuccess : styles.alertError}>
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className={styles.alertText}>{status.message}</p>
            </div>
          )}

          {isLoading ? (
            <div className={styles.spinner} />
          ) : victims.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Şu an tesisinize ait aktif (yakını aranılan) bir vaka bulunmamaktadır.</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Vaka No</th>
                    <th>Cinsiyet / Yaş</th>
                    <th>İl / İlçe</th>
                    <th>Kayıt Tarihi</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {victims.map(v => (
                    <tr key={v.id}>
                      <td><strong>{v.caseNumber}</strong></td>
                      <td>{v.gender} / {v.ageGroup}</td>
                      <td>{v.province} - {v.district}</td>
                      <td>{new Date(v.recordedAt).toLocaleString('tr-TR')}</td>
                      <td>
                        <button
                          onClick={() => handleResolve(v.id, v.caseNumber)}
                          className={styles.resolveBtn}
                          title="Yakınına Ulaşıldı (Sonuçlandır)"
                        >
                          <Check size={16} />
                          Sonuçlandır
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
