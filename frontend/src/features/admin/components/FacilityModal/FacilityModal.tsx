import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import axios from 'axios';
import styles from './FacilityModal.module.css';

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  facility: any | null;
}

export const FacilityModal: React.FC<FacilityModalProps> = ({ isOpen, onClose, onSave, facility }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('HOSPITAL');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (facility) {
      setName(facility.name || '');
      setType(facility.type || 'HOSPITAL');
      setAddress(facility.address || '');
    } else {
      setName('');
      setType('HOSPITAL');
      setAddress('');
    }
  }, [facility, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        name,
        type,
        address
      };

      if (facility?.id) {
        // Düzenleme
        await axios.put(`http://localhost:8080/api/v1/facilities/${facility.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Yeni Kayıt
        await axios.post('http://localhost:8080/api/v1/facilities', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      onSave();
    } catch (error) {
      console.error('Tesis kaydedilirken hata:', error);
      alert('Tesis kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{facility ? 'Tesisi Düzenle' : 'Yeni Tesis Ekle'}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tesis Adı</label>
              <input
                type="text"
                className={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Örn: Merkez Devlet Hastanesi"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tesis Türü</label>
              <select
                className={styles.input}
                value={type}
                onChange={e => setType(e.target.value)}
                required
              >
                <option value="HOSPITAL">Hastane</option>
                <option value="FIELD_STATION">Sahra Çadırı / Toplanma Alanı</option>
                <option value="TRIAGE_POINT">Triyaj Noktası</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Adres</label>
              <textarea
                className={styles.input}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Tesisin açık adresi (Opsiyonel)"
              />
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              İptal
            </button>
            <button type="submit" className={styles.saveButton} disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : (
                <>
                  <Save size={18} />
                  <span>Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
