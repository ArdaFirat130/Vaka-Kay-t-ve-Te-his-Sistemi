import { MapPin, User, Tag, Shirt, Heart, Calendar, Activity, X } from 'lucide-react';
import { Button } from '../Button';
import styles from './VictimDetailModal.module.css';
import type { DtoVictim } from '../../features/search/services/searchService';

// ─── Translation Maps ─────────────────────────────────────────────────────────
export const GENDER_MAP: Record<string, string> = { MALE: 'Erkek', FEMALE: 'Kadın', UNKNOWN: 'Bilinmiyor' };
export const AGE_MAP: Record<string, string> = {
  AGE_0_5: '0-5 Yaş', AGE_6_12: '6-12 Yaş', AGE_13_17: '13-17 Yaş',
  AGE_18_30: '18-30 Yaş', AGE_31_45: '31-45 Yaş', AGE_46_60: '46-60 Yaş',
  AGE_61_75: '61-75 Yaş', AGE_75_PLUS: '75+ Yaş', UNKNOWN: 'Bilinmiyor',
  INFANT: '0-5 Yaş', CHILD: '6-12 Yaş', TEENAGER: '13-17 Yaş',
  YOUNG_ADULT: '18-30 Yaş', ADULT: '31-45 Yaş', MIDDLE_AGED: '46-60 Yaş',
  SENIOR: '61-75 Yaş', ELDERLY: '75+ Yaş',
};
export const HEIGHT_MAP: Record<string, string> = {
  UNDER_150: '150 cm altı', H_150_160: '150-160 cm', H_161_170: '161-170 cm',
  H_171_180: '171-180 cm', H_181_190: '181-190 cm', OVER_190: '190 cm üstü',
  UNKNOWN: 'Bilinmiyor',
};
export const BODY_MAP: Record<string, string> = { THIN: 'Zayıf', NORMAL: 'Normal', OVERWEIGHT: 'Kilolu', OBESE: 'Şişman', UNKNOWN: 'Bilinmiyor' };
export const SKIN_MAP: Record<string, string> = { VERY_LIGHT: 'Çok Açık', LIGHT: 'Açık / Buğday', MEDIUM: 'Orta / Esmer', DARK: 'Koyu Esmer', VERY_DARK: 'Siyahi', UNKNOWN: 'Bilinmiyor' };
export const EYE_MAP: Record<string, string> = { BLACK: 'Siyah', BROWN: 'Kahverengi', GREEN: 'Yeşil', BLUE: 'Mavi', HAZEL: 'Ela', UNKNOWN: 'Bilinmiyor' };
export const HAIR_COLOR_MAP: Record<string, string> = { BLACK: 'Siyah', BROWN: 'Kahverengi', BLONDE: 'Sarı', RED: 'Kızıl', GRAY: 'Gri / Beyaz', UNKNOWN: 'Bilinmiyor' };
export const HAIR_LENGTH_MAP: Record<string, string> = { BALD: 'Kel / Tıraşlı', SHORT: 'Kısa', MEDIUM: 'Orta', LONG: 'Uzun', UNKNOWN: 'Bilinmiyor' };
export const HAIR_TYPE_MAP: Record<string, string> = { STRAIGHT: 'Düz', WAVY: 'Dalgalı', CURLY: 'Kıvırcık', UNKNOWN: 'Bilinmiyor' };
export const FACIAL_HAIR_MAP: Record<string, string> = { NONE: 'Yok', MUSTACHE: 'Bıyık', BEARD: 'Sakal', SHORT_BEARD: 'Kirli Sakal', LONG_BEARD: 'Tam Sakal', UNKNOWN: 'Bilinmiyor' };
export const HEALTH_MAP: Record<string, string> = { STABLE: 'Sağlıklı / Hafif Yaralı', SERIOUS: 'Yaralı (Stabil)', CRITICAL: 'Ağır Yaralı (Kritik)', DECEASED: 'Vefat Etmiş', UNKNOWN: 'Bilinmiyor' };
export const CONSCIOUSNESS_MAP: Record<string, string> = { CONSCIOUS: 'Açık (İletişim kuruluyor)', CONFUSED: 'Yarı Açık (Sersemlemiş)', UNCONSCIOUS: 'Kapalı (Tepkisiz)', UNKNOWN: 'Bilinmiyor' };
export const GLASSES_MAP: Record<string, string> = { NONE: 'Yok', GLASSES: 'Numaralı Gözlük', SUNGLASSES: 'Güneş Gözlüğü', UNKNOWN: 'Bilinmiyor' };
export const HEADSCARF_MAP: Record<string, string> = { YES: 'Kullanıyor', NONE: 'Kullanmıyor', UNKNOWN: 'Bilinmiyor' };
export const BODY_PART_MAP: Record<string, string> = {
  RIGHT_ARM: 'Sağ Kol', LEFT_ARM: 'Sol Kol', RIGHT_LEG: 'Sağ Bacak', LEFT_LEG: 'Sol Bacak',
  NECK: 'Boyun', TORSO: 'Gövde (Göğüs/Sırt)', FACE: 'Yüz', OTHER: 'Diğer',
};
export const TATTOO_SHAPE_MAP: Record<string, string> = { TEXT: 'Yazı / Harf', ANIMAL: 'Hayvan', TRIBAL: 'Tribal', SYMBOL: 'Sembol / Logo', PORTRAIT: 'Portre', OTHER: 'Diğer' };
export const PROSTHETIC_MAP: Record<string, string> = { ARM_PROSTHETIC: 'Kol Protezi', LEG_PROSTHETIC: 'Bacak Protezi', HEARING_AID: 'İşitme Cihazı', PACEMAKER: 'Kalp Pili', OTHER: 'Diğer' };
export const DENTAL_MAP: Record<string, string> = { NORMAL: 'Normal', MISSING_TEETH: 'Eksik Diş', DENTURE: 'Protez Diş', BRACES: 'Diş Teli' };
export const JEWELRY_MAP: Record<string, string> = { RING: 'Yüzük', NECKLACE: 'Kolye', BRACELET: 'Bileklik', EARRING: 'Küpe', WATCH: 'Saat', OTHER: 'Diğer' };
export const CLOTHING_MAP: Record<string, string> = {
  T_SHIRT: 'Tişört', SHIRT: 'Gömlek', SWEATER: 'Kazak', JACKET_COAT: 'Mont / Kaban',
  SWEATSHIRT: 'Sweatshirt', BLOUSE_TUNIC: 'Bluz / Tunik', TANK_TOP: 'Atlet',
  JEANS: 'Kot Pantolon', TROUSERS: 'Kumaş Pantolon', SWEATPANTS: 'Eşofman',
  SHORTS: 'Şort', SKIRT: 'Etek', DRESS: 'Elbise', OTHER: 'Diğer',
};
export const CHRONIC_MAP: Record<string, string> = { DIABETES: 'Diyabet', HYPERTENSION: 'Hipertansiyon', HEART: 'Kalp Rahatsızlığı', EPILEPSY: 'Epilepsi', ASTHMA: 'Astım', OTHER: 'Diğer' };
export const LANG_MAP: Record<string, string> = { TURKISH: 'Türkçe', KURDISH: 'Kürtçe', ARABIC: 'Arapça', ENGLISH: 'İngilizce', CANNOT_COMMUNICATE: 'İletişim Kurulamıyor' };

export const tr = (map: Record<string, string>, key?: string | null) => (key ? map[key] ?? key : '—');
export const trList = (map: Record<string, string>, list?: string[] | null) =>
  list && list.length > 0 ? list.map(k => map[k] ?? k).join(', ') : '—';

export interface VictimDetailModalProps {
  victim: DtoVictim;
  matchScore?: number;
  matchedCriteriaCount?: number;
  totalProvidedCriteriaCount?: number;
  onClose: () => void;
}

export const VictimDetailModal = ({ victim: v, matchScore, matchedCriteriaCount, totalProvidedCriteriaCount, onClose }: VictimDetailModalProps) => {

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const isSearchMode = matchScore !== undefined;
  const scoreColor = isSearchMode ? getScoreColor(matchScore) : '#3b82f6';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            {isSearchMode && (
              <div className={styles.modalScoreBadge} style={{ borderColor: scoreColor, color: scoreColor }}>
                %{Math.round(matchScore)} Eşleşme
              </div>
            )}
            <div>
              <h2 className={styles.modalTitle}>Vaka #{v.caseNumber}</h2>
              <p className={styles.modalSubtitle}>
                <MapPin size={14} /> {v.facilityName || '—'} — {v.province}, {v.district}
              </p>
            </div>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Photo */}
          {v.photoUrl && (
            <div className={styles.modalPhotoSection}>
              <img src={v.photoUrl} alt="Vaka Fotoğrafı" className={styles.modalPhoto} />
            </div>
          )}

          <div className={styles.modalGrid}>
            {/* Section: Temel Bilgiler */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}><User size={16} /> Temel Bilgiler</h3>
              <div className={styles.modalInfoGrid}>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Cinsiyet</span>
                  <span className={styles.modalInfoValue}>{tr(GENDER_MAP, v.gender)}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Yaş Grubu</span>
                  <span className={styles.modalInfoValue}>{tr(AGE_MAP, v.ageGroup)}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Boy</span>
                  <span className={styles.modalInfoValue}>{tr(HEIGHT_MAP, v.heightRange)}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Vücut Yapısı</span>
                  <span className={styles.modalInfoValue}>{tr(BODY_MAP, v.bodyType)}</span>
                </div>
              </div>
            </div>

            {/* Section: Görünüm */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}><Tag size={16} /> Görünüm & Saç</h3>
              <div className={styles.modalInfoGrid}>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Ten Rengi</span>
                  <span className={styles.modalInfoValue}>{tr(SKIN_MAP, v.skinTone)}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Göz Rengi</span>
                  <span className={styles.modalInfoValue}>{tr(EYE_MAP, v.eyeColor)}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Saç Rengi</span>
                  <span className={styles.modalInfoValue}>{tr(HAIR_COLOR_MAP, v.hairColor)}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Saç Uzunluğu</span>
                  <span className={styles.modalInfoValue}>{tr(HAIR_LENGTH_MAP, v.hairLength)}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Saç Yapısı</span>
                  <span className={styles.modalInfoValue}>{tr(HAIR_TYPE_MAP, v.hairType)}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Yüz Kılı</span>
                  <span className={styles.modalInfoValue}>{tr(FACIAL_HAIR_MAP, v.facialHair)}</span>
                </div>
              </div>
            </div>

            {/* Section: Ayırt Edici İzler */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}><Tag size={16} /> Ayırt Edici İzler</h3>
              <div className={styles.modalInfoList}>
                {v.hasTattoo && (
                  <div className={styles.modalBadgeRow}>
                    <span className={styles.modalBadge} style={{ background: 'rgba(139,92,246,0.1)', color: '#7c3aed' }}>Dövme Var</span>
                    {v.tattooLocation?.length > 0 && <span className={styles.modalInfoSmall}>Bölge: {trList(BODY_PART_MAP, v.tattooLocation)}</span>}
                    {v.tattooShape?.length > 0 && <span className={styles.modalInfoSmall}>Şekil: {trList(TATTOO_SHAPE_MAP, v.tattooShape)}</span>}
                  </div>
                )}
                {v.hasScar && (
                  <div className={styles.modalBadgeRow}>
                    <span className={styles.modalBadge} style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>Yara İzi Var</span>
                    {v.scarLocation?.length > 0 && <span className={styles.modalInfoSmall}>Bölge: {trList(BODY_PART_MAP, v.scarLocation)}</span>}
                  </div>
                )}
                {v.hasBirthmark && (
                  <div className={styles.modalBadgeRow}>
                    <span className={styles.modalBadge} style={{ background: 'rgba(234,179,8,0.1)', color: '#ca8a04' }}>Doğum Lekesi Var</span>
                    {v.birthmarkLocation?.length > 0 && <span className={styles.modalInfoSmall}>Bölge: {trList(BODY_PART_MAP, v.birthmarkLocation)}</span>}
                  </div>
                )}
                {v.prosthetics?.length > 0 && (
                  <div className={styles.modalInfoItem}>
                    <span className={styles.modalInfoLabel}>Protez / Cihaz</span>
                    <span className={styles.modalInfoValue}>{trList(PROSTHETIC_MAP, v.prosthetics)}</span>
                  </div>
                )}
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Gözlük</span>
                  <span className={styles.modalInfoValue}>{tr(GLASSES_MAP, v.wearsGlasses)}</span>
                </div>
                {v.dentalFeatures?.length > 0 && (
                  <div className={styles.modalInfoItem}>
                    <span className={styles.modalInfoLabel}>Diş Özellikleri</span>
                    <span className={styles.modalInfoValue}>{trList(DENTAL_MAP, v.dentalFeatures)}</span>
                  </div>
                )}
                {!v.hasTattoo && !v.hasScar && !v.hasBirthmark && (
                  <p className={styles.modalEmpty}>Belirgin ayırt edici iz kaydedilmemiş.</p>
                )}
              </div>
            </div>

            {/* Section: Kıyafet & Aksesuar */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}><Shirt size={16} /> Kıyafet & Aksesuar</h3>
              <div className={styles.modalInfoGrid}>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Üst Kıyafet</span>
                  <span className={styles.modalInfoValue}>{trList(CLOTHING_MAP, v.upperClothingType)}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Alt Kıyafet</span>
                  <span className={styles.modalInfoValue}>{trList(CLOTHING_MAP, v.lowerClothingType)}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Takı</span>
                  <span className={styles.modalInfoValue}>{trList(JEWELRY_MAP, v.jewelry)}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Başörtüsü</span>
                  <span className={styles.modalInfoValue}>{tr(HEADSCARF_MAP, v.wearsHeadscarf)}</span>
                </div>
              </div>
            </div>

            {/* Section: Sağlık */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}><Heart size={16} /> Sağlık Durumu</h3>
              <div className={styles.modalInfoGrid}>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Sağlık Durumu</span>
                  <span className={`${styles.modalInfoValue} ${v.healthStatus === 'DECEASED' ? styles.deceased : ''}`}>
                    {tr(HEALTH_MAP, v.healthStatus)}
                  </span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Bilinç Durumu</span>
                  <span className={styles.modalInfoValue}>{tr(CONSCIOUSNESS_MAP, v.consciousness)}</span>
                </div>
                {v.chronicConditions?.length > 0 && (
                  <div className={styles.modalInfoItem}>
                    <span className={styles.modalInfoLabel}>Kronik Hastalık</span>
                    <span className={styles.modalInfoValue}>{trList(CHRONIC_MAP, v.chronicConditions)}</span>
                  </div>
                )}
                {v.spokenLanguages?.length > 0 && (
                  <div className={styles.modalInfoItem}>
                    <span className={styles.modalInfoLabel}>Konuştuğu Dil</span>
                    <span className={styles.modalInfoValue}>{trList(LANG_MAP, v.spokenLanguages)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Kayıt & Tesis Bilgisi */}
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}><Calendar size={16} /> Kayıt Bilgisi</h3>
              <div className={styles.modalInfoGrid}>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Kayıt Tarihi</span>
                  <span className={styles.modalInfoValue}>
                    {v.recordedAt ? new Date(v.recordedAt).toLocaleString('tr-TR') : '—'}
                  </span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Tesis</span>
                  <span className={styles.modalInfoValue}>{v.facilityName || '—'}</span>
                </div>
                <div className={styles.modalInfoItem}>
                  <span className={styles.modalInfoLabel}>Bulunduğu İl / İlçe</span>
                  <span className={styles.modalInfoValue}>{v.province} / {v.district}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Match Stats (Only for search mode) */}
          {isSearchMode && (
            <div className={styles.modalMatchStats}>
              <Activity size={16} />
              <span>
                <strong>{matchedCriteriaCount}</strong> / {totalProvidedCriteriaCount} kriterde eşleşme —{' '}
                <strong style={{ color: scoreColor }}>%{Math.round(matchScore)}</strong> uyum skoru
              </span>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <p className={styles.modalNote}>
            {isSearchMode 
              ? "⚠️ Bu bilgiler sadece kaba eşleşme amacıyla sunulmaktadır. Kesin kimlik tespiti için lütfen tesis yetkilisiyle iletişime geçin."
              : "Bu bilgiler hastane / tesis yetkilisi tarafından sisteme girilmiştir."}
          </p>
          <Button onClick={onClose}>Kapat</Button>
        </div>
      </div>
    </div>
  );
};
