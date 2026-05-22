import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Filter, AlertCircle, LogOut, X, MapPin, Calendar, User, Activity, Tag, Shirt, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { executeSearch, clearSearch } from '../searchSlice';
import { logout } from '../../auth/authSlice';
import { Button } from '../../../components/Button';
import { Select } from '../../../components/Select';
import { Checkbox } from '../../../components/Checkbox';
import { MultiCheckbox } from '../../../components/MultiCheckbox';
import turkeyData from '../../../data/turkeyProvinces.json';
import styles from './SearchPage.module.css';
import type { DtoVictim, VictimSearchResult } from '../services/searchService';

// ─── Translation Maps ─────────────────────────────────────────────────────────
const GENDER_MAP: Record<string, string> = { MALE: 'Erkek', FEMALE: 'Kadın', UNKNOWN: 'Bilinmiyor' };
const AGE_MAP: Record<string, string> = {
  AGE_0_5: '0-5 Yaş', AGE_6_12: '6-12 Yaş', AGE_13_17: '13-17 Yaş',
  AGE_18_30: '18-30 Yaş', AGE_31_45: '31-45 Yaş', AGE_46_60: '46-60 Yaş',
  AGE_61_75: '61-75 Yaş', AGE_75_PLUS: '75+ Yaş', UNKNOWN: 'Bilinmiyor',
  INFANT: '0-5 Yaş', CHILD: '6-12 Yaş', TEENAGER: '13-17 Yaş',
  YOUNG_ADULT: '18-30 Yaş', ADULT: '31-45 Yaş', MIDDLE_AGED: '46-60 Yaş',
  SENIOR: '61-75 Yaş', ELDERLY: '75+ Yaş',
};
const HEIGHT_MAP: Record<string, string> = {
  UNDER_150: '150 cm altı', H_150_160: '150-160 cm', H_161_170: '161-170 cm',
  H_171_180: '171-180 cm', H_181_190: '181-190 cm', OVER_190: '190 cm üstü',
  UNKNOWN: 'Bilinmiyor',
};
const BODY_MAP: Record<string, string> = { THIN: 'Zayıf', NORMAL: 'Normal', OVERWEIGHT: 'Kilolu', OBESE: 'Şişman', UNKNOWN: 'Bilinmiyor' };
const SKIN_MAP: Record<string, string> = { VERY_LIGHT: 'Çok Açık', LIGHT: 'Açık / Buğday', MEDIUM: 'Orta / Esmer', DARK: 'Koyu Esmer', VERY_DARK: 'Siyahi', UNKNOWN: 'Bilinmiyor' };
const EYE_MAP: Record<string, string> = { BLACK: 'Siyah', BROWN: 'Kahverengi', GREEN: 'Yeşil', BLUE: 'Mavi', HAZEL: 'Ela', UNKNOWN: 'Bilinmiyor' };
const HAIR_COLOR_MAP: Record<string, string> = { BLACK: 'Siyah', BROWN: 'Kahverengi', BLONDE: 'Sarı', RED: 'Kızıl', GRAY: 'Gri / Beyaz', UNKNOWN: 'Bilinmiyor' };
const HAIR_LENGTH_MAP: Record<string, string> = { BALD: 'Kel / Tıraşlı', SHORT: 'Kısa', MEDIUM: 'Orta', LONG: 'Uzun', UNKNOWN: 'Bilinmiyor' };
const HAIR_TYPE_MAP: Record<string, string> = { STRAIGHT: 'Düz', WAVY: 'Dalgalı', CURLY: 'Kıvırcık', UNKNOWN: 'Bilinmiyor' };
const FACIAL_HAIR_MAP: Record<string, string> = { NONE: 'Yok', MUSTACHE: 'Bıyık', BEARD: 'Sakal', SHORT_BEARD: 'Kirli Sakal', LONG_BEARD: 'Tam Sakal', UNKNOWN: 'Bilinmiyor' };
const HEALTH_MAP: Record<string, string> = { STABLE: 'Sağlıklı / Hafif Yaralı', SERIOUS: 'Yaralı (Stabil)', CRITICAL: 'Ağır Yaralı (Kritik)', DECEASED: 'Vefat Etmiş', UNKNOWN: 'Bilinmiyor' };
const CONSCIOUSNESS_MAP: Record<string, string> = { CONSCIOUS: 'Açık (İletişim kuruluyor)', CONFUSED: 'Yarı Açık (Sersemlemiş)', UNCONSCIOUS: 'Kapalı (Tepkisiz)', UNKNOWN: 'Bilinmiyor' };
const GLASSES_MAP: Record<string, string> = { NONE: 'Yok', GLASSES: 'Numaralı Gözlük', SUNGLASSES: 'Güneş Gözlüğü', UNKNOWN: 'Bilinmiyor' };
const HEADSCARF_MAP: Record<string, string> = { YES: 'Kullanıyor', NONE: 'Kullanmıyor', UNKNOWN: 'Bilinmiyor' };
const BODY_PART_MAP: Record<string, string> = {
  RIGHT_ARM: 'Sağ Kol', LEFT_ARM: 'Sol Kol', RIGHT_LEG: 'Sağ Bacak', LEFT_LEG: 'Sol Bacak',
  NECK: 'Boyun', TORSO: 'Gövde (Göğüs/Sırt)', FACE: 'Yüz', OTHER: 'Diğer',
};
const TATTOO_SHAPE_MAP: Record<string, string> = { TEXT: 'Yazı / Harf', ANIMAL: 'Hayvan', TRIBAL: 'Tribal', SYMBOL: 'Sembol / Logo', PORTRAIT: 'Portre', OTHER: 'Diğer' };
const PROSTHETIC_MAP: Record<string, string> = { ARM_PROSTHETIC: 'Kol Protezi', LEG_PROSTHETIC: 'Bacak Protezi', HEARING_AID: 'İşitme Cihazı', PACEMAKER: 'Kalp Pili', OTHER: 'Diğer' };
const DENTAL_MAP: Record<string, string> = { NORMAL: 'Normal', MISSING_TEETH: 'Eksik Diş', DENTURE: 'Protez Diş', BRACES: 'Diş Teli' };
const JEWELRY_MAP: Record<string, string> = { RING: 'Yüzük', NECKLACE: 'Kolye', BRACELET: 'Bileklik', EARRING: 'Küpe', WATCH: 'Saat', OTHER: 'Diğer' };
const CLOTHING_MAP: Record<string, string> = {
  T_SHIRT: 'Tişört', SHIRT: 'Gömlek', SWEATER: 'Kazak', JACKET_COAT: 'Mont / Kaban',
  SWEATSHIRT: 'Sweatshirt', BLOUSE_TUNIC: 'Bluz / Tunik', TANK_TOP: 'Atlet',
  JEANS: 'Kot Pantolon', TROUSERS: 'Kumaş Pantolon', SWEATPANTS: 'Eşofman',
  SHORTS: 'Şort', SKIRT: 'Etek', DRESS: 'Elbise', OTHER: 'Diğer',
};
const CHRONIC_MAP: Record<string, string> = { DIABETES: 'Diyabet', HYPERTENSION: 'Hipertansiyon', HEART: 'Kalp Rahatsızlığı', EPILEPSY: 'Epilepsi', ASTHMA: 'Astım', OTHER: 'Diğer' };
const LANG_MAP: Record<string, string> = { TURKISH: 'Türkçe', KURDISH: 'Kürtçe', ARABIC: 'Arapça', ENGLISH: 'İngilizce', CANNOT_COMMUNICATE: 'İletişim Kurulamıyor' };

const tr = (map: Record<string, string>, key?: string | null) => (key ? map[key] ?? key : '—');
const trList = (map: Record<string, string>, list?: string[] | null) =>
  list && list.length > 0 ? list.map(k => map[k] ?? k).join(', ') : '—';

// ─── Detail Modal ─────────────────────────────────────────────────────────────
interface DetailModalProps {
  result: VictimSearchResult;
  onClose: () => void;
}

const DetailModal = ({ result, onClose }: DetailModalProps) => {
  const v: DtoVictim = result.victim;

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const scoreColor = getScoreColor(result.matchScore);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalScoreBadge} style={{ borderColor: scoreColor, color: scoreColor }}>
              %{Math.round(result.matchScore)} Eşleşme
            </div>
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

          {/* Match Stats */}
          <div className={styles.modalMatchStats}>
            <Activity size={16} />
            <span>
              <strong>{result.matchedCriteriaCount}</strong> / {result.totalProvidedCriteriaCount} kriterde eşleşme —{' '}
              <strong style={{ color: scoreColor }}>%{Math.round(result.matchScore)}</strong> uyum skoru
            </span>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <p className={styles.modalNote}>
            ⚠️ Bu bilgiler sadece kaba eşleşme amacıyla sunulmaktadır. Kesin kimlik tespiti için lütfen tesis yetkilisiyle iletişime geçin.
          </p>
          <Button onClick={onClose}>Kapat</Button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Search Page ─────────────────────────────────────────────────────────
export const SearchPage = () => {
  const dispatch = useAppDispatch();
  const { results, isLoading, error, hasSearched } = useAppSelector((state) => state.search);
  const { role } = useAppSelector((state) => state.auth);
  const [selectedResult, setSelectedResult] = useState<VictimSearchResult | null>(null);

  const { register, handleSubmit, reset, control, watch } = useForm();

  const selectedProvinceId = watch('province');
  const hasTattoo = watch('hasTattoo');
  const hasScar = watch('hasScar');
  const hasBirthmark = watch('hasBirthmark');

  const selectedProvinceData = turkeyData.find(p => p.id.toString() === selectedProvinceId);
  const districts = selectedProvinceData ? selectedProvinceData.districts : [];

  if (role !== 'ROLE_RELATIVE') {
    return (
      <div className={styles.unauthorized}>
        <h2>Yetkisiz Erişim</h2>
        <p>Bu sayfayı görüntüleme yetkiniz yok.</p>
        <Button onClick={() => dispatch(logout())}>Çıkış Yap</Button>
      </div>
    );
  }

  const onSubmit = (data: any) => {
    // ✅ FIX: Convert province/district IDs to actual names before sending to backend
    const provinceName = selectedProvinceData?.name || '';
    const districtName = districts.find(d => d.id.toString() === data.district)?.name || '';

    // Remove empty/undefined/false values
    const payload: any = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) return;
      if (Array.isArray(value) && value.length === 0) return;
      payload[key] = value;
    });

    // Replace IDs with names
    if (provinceName) payload.province = provinceName;
    else delete payload.province;
    if (districtName) payload.district = districtName;
    else delete payload.district;

    // Fix clothing arrays
    if (payload.upperClothingType && !Array.isArray(payload.upperClothingType)) {
      payload.upperClothingType = [payload.upperClothingType];
    }
    if (payload.lowerClothingType && !Array.isArray(payload.lowerClothingType)) {
      payload.lowerClothingType = [payload.lowerClothingType];
    }

    dispatch(executeSearch(payload));
  };

  const handleReset = () => {
    reset();
    dispatch(clearSearch());
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoInfo}>
            <Search className={styles.logoIcon} />
            <h2>Vaka Arama Sistemi</h2>
          </div>
          <Button variant="ghost" onClick={() => dispatch(logout())} icon={<LogOut size={18} />}>
            Güvenli Çıkış
          </Button>
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* Left Column: Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3><Filter size={18} /> Filtreler</h3>
            <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
              Temizle
            </Button>
          </div>

          <form id="searchForm" onSubmit={handleSubmit(onSubmit)} className={styles.filterForm}>

            {/* Section 1: Lokasyon */}
            <div className={styles.filterSection}>
              <h4>Lokasyon Bilgileri</h4>
              <Select
                label="İl"
                {...register('province')}
                options={[
                  { label: 'Tüm İller', value: '' },
                  ...turkeyData.map(p => ({ label: p.name, value: p.id.toString() }))
                ]}
              />
              <Select
                label="İlçe"
                {...register('district')}
                disabled={!selectedProvinceId}
                options={[
                  { label: 'Tüm İlçeler', value: '' },
                  ...districts.map(d => ({ label: d.name, value: d.id.toString() }))
                ]}
              />
            </div>

            {/* Section 2: Temel Fiziksel */}
            <div className={styles.filterSection}>
              <h4>Temel Fiziksel</h4>
              <Select
                label="Cinsiyet"
                {...register('gender')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Erkek', value: 'MALE' },
                  { label: 'Kadın', value: 'FEMALE' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
              <Select
                label="Yaş Grubu"
                {...register('ageGroup')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: '0-5 Yaş', value: 'AGE_0_5' },
                  { label: '6-12 Yaş', value: 'AGE_6_12' },
                  { label: '13-17 Yaş', value: 'AGE_13_17' },
                  { label: '18-30 Yaş', value: 'AGE_18_30' },
                  { label: '31-45 Yaş', value: 'AGE_31_45' },
                  { label: '46-60 Yaş', value: 'AGE_46_60' },
                  { label: '61-75 Yaş', value: 'AGE_61_75' },
                  { label: '75+ Yaş', value: 'AGE_75_PLUS' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
              <Select
                label="Boy Aralığı"
                {...register('heightRange')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: '150 cm altı', value: 'UNDER_150' },
                  { label: '150-160 cm', value: 'H_150_160' },
                  { label: '161-170 cm', value: 'H_161_170' },
                  { label: '171-180 cm', value: 'H_171_180' },
                  { label: '181-190 cm', value: 'H_181_190' },
                  { label: '190 cm üstü', value: 'OVER_190' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
              <Select
                label="Vücut Yapısı"
                {...register('bodyType')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Zayıf', value: 'THIN' },
                  { label: 'Normal', value: 'NORMAL' },
                  { label: 'Kilolu', value: 'OVERWEIGHT' },
                  { label: 'Şişman', value: 'OBESE' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
            </div>

            {/* Section 3: Görünüm */}
            <div className={styles.filterSection}>
              <h4>Görünüm & Saç</h4>
              <Select
                label="Ten Rengi"
                {...register('skinTone')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Çok Açık / Beyaz', value: 'VERY_LIGHT' },
                  { label: 'Açık / Buğday', value: 'LIGHT' },
                  { label: 'Orta / Esmer', value: 'MEDIUM' },
                  { label: 'Koyu Esmer', value: 'DARK' },
                  { label: 'Siyahi', value: 'VERY_DARK' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
              <Select
                label="Göz Rengi"
                {...register('eyeColor')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Siyah', value: 'BLACK' },
                  { label: 'Kahverengi', value: 'BROWN' },
                  { label: 'Yeşil', value: 'GREEN' },
                  { label: 'Mavi', value: 'BLUE' },
                  { label: 'Ela', value: 'HAZEL' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
              <Select
                label="Saç Rengi"
                {...register('hairColor')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Siyah', value: 'BLACK' },
                  { label: 'Kahverengi', value: 'BROWN' },
                  { label: 'Sarı', value: 'BLONDE' },
                  { label: 'Kızıl', value: 'RED' },
                  { label: 'Gri / Beyaz', value: 'GRAY' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
              <Select
                label="Saç Uzunluğu"
                {...register('hairLength')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Kel / Tıraşlı', value: 'BALD' },
                  { label: 'Kısa', value: 'SHORT' },
                  { label: 'Orta', value: 'MEDIUM' },
                  { label: 'Uzun', value: 'LONG' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
              <Select
                label="Saç Yapısı"
                {...register('hairType')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Düz', value: 'STRAIGHT' },
                  { label: 'Dalgalı', value: 'WAVY' },
                  { label: 'Kıvırcık', value: 'CURLY' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
              <Select
                label="Yüz Kılı"
                {...register('facialHair')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Yok (Tıraşlı)', value: 'NONE' },
                  { label: 'Kirli Sakal', value: 'SHORT_BEARD' },
                  { label: 'Sadece Bıyık', value: 'MUSTACHE' },
                  { label: 'Tam Sakal', value: 'LONG_BEARD' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
            </div>

            {/* Section 4: Ayırt Edici İzler */}
            <div className={styles.filterSection}>
              <h4>Ayırt Edici İzler</h4>
              <Checkbox label="Dövme var mı?" {...register('hasTattoo')} />
              {hasTattoo && (
                <>
                  <MultiCheckbox name="tattooLocation" control={control} label="Dövme Bölgeleri"
                    options={[
                      { label: 'Sağ Kol', value: 'RIGHT_ARM' }, { label: 'Sol Kol', value: 'LEFT_ARM' },
                      { label: 'Sağ Bacak', value: 'RIGHT_LEG' }, { label: 'Sol Bacak', value: 'LEFT_LEG' },
                      { label: 'Boyun', value: 'NECK' }, { label: 'Gövde', value: 'TORSO' },
                      { label: 'Yüz', value: 'FACE' }, { label: 'Diğer', value: 'OTHER' },
                    ]}
                  />
                  <MultiCheckbox name="tattooShape" control={control} label="Dövme Şekli"
                    options={[
                      { label: 'Yazı / Harf', value: 'TEXT' }, { label: 'Hayvan', value: 'ANIMAL' },
                      { label: 'Tribal / Kabile', value: 'TRIBAL' }, { label: 'Sembol / Logo', value: 'SYMBOL' },
                      { label: 'Portre / İnsan', value: 'PORTRAIT' }, { label: 'Diğer', value: 'OTHER' },
                    ]}
                  />
                </>
              )}
              <Checkbox label="Yara izi var mı?" {...register('hasScar')} />
              {hasScar && (
                <MultiCheckbox name="scarLocation" control={control} label="Yara İzi Bölgeleri"
                  options={[
                    { label: 'Sağ Kol', value: 'RIGHT_ARM' }, { label: 'Sol Kol', value: 'LEFT_ARM' },
                    { label: 'Sağ Bacak', value: 'RIGHT_LEG' }, { label: 'Sol Bacak', value: 'LEFT_LEG' },
                    { label: 'Boyun', value: 'NECK' }, { label: 'Gövde', value: 'TORSO' },
                    { label: 'Yüz', value: 'FACE' }, { label: 'Diğer', value: 'OTHER' },
                  ]}
                />
              )}
              <Checkbox label="Doğum lekesi var mı?" {...register('hasBirthmark')} />
              {hasBirthmark && (
                <MultiCheckbox name="birthmarkLocation" control={control} label="Doğum Lekesi Bölgeleri"
                  options={[
                    { label: 'Sağ Kol', value: 'RIGHT_ARM' }, { label: 'Sol Kol', value: 'LEFT_ARM' },
                    { label: 'Sağ Bacak', value: 'RIGHT_LEG' }, { label: 'Sol Bacak', value: 'LEFT_LEG' },
                    { label: 'Boyun', value: 'NECK' }, { label: 'Gövde', value: 'TORSO' },
                    { label: 'Yüz', value: 'FACE' }, { label: 'Diğer', value: 'OTHER' },
                  ]}
                />
              )}
              <MultiCheckbox name="prosthetics" control={control} label="Protez / Cihaz"
                options={[
                  { label: 'Kol Protezi', value: 'ARM_PROSTHETIC' }, { label: 'Bacak Protezi', value: 'LEG_PROSTHETIC' },
                  { label: 'İşitme Cihazı', value: 'HEARING_AID' }, { label: 'Kalp Pili', value: 'PACEMAKER' },
                  { label: 'Diğer', value: 'OTHER' },
                ]}
              />
              <MultiCheckbox name="dentalFeatures" control={control} label="Diş Yapısı"
                options={[
                  { label: 'Normal', value: 'NORMAL' }, { label: 'Eksik Diş', value: 'MISSING_TEETH' },
                  { label: 'Protez Diş', value: 'DENTURE' }, { label: 'Diş Teli', value: 'BRACES' },
                ]}
              />
              <Select label="Gözlük Kullanımı" {...register('wearsGlasses')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Numaralı Gözlük', value: 'GLASSES' },
                  { label: 'Güneş Gözlüğü', value: 'SUNGLASSES' },
                  { label: 'Kullanmıyor', value: 'NONE' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
            </div>

            {/* Section 5: Aksesuar */}
            <div className={styles.filterSection}>
              <h4>Kıyafet & Aksesuar</h4>
              <Select label="Üst Kıyafet" {...register('upperClothingType')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Tişört', value: 'T_SHIRT' }, { label: 'Gömlek', value: 'SHIRT' },
                  { label: 'Kazak', value: 'SWEATER' }, { label: 'Mont / Kaban', value: 'JACKET_COAT' },
                  { label: 'Sweatshirt', value: 'SWEATSHIRT' }, { label: 'Bluz / Tunik', value: 'BLOUSE_TUNIC' },
                  { label: 'Atlet', value: 'TANK_TOP' },
                ]}
              />
              <Select label="Alt Kıyafet" {...register('lowerClothingType')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Kot Pantolon', value: 'JEANS' }, { label: 'Kumaş Pantolon', value: 'TROUSERS' },
                  { label: 'Eşofman', value: 'SWEATPANTS' }, { label: 'Şort', value: 'SHORTS' },
                  { label: 'Etek', value: 'SKIRT' }, { label: 'Elbise', value: 'DRESS' },
                  { label: 'Diğer', value: 'OTHER' },
                ]}
              />
              <MultiCheckbox name="jewelry" control={control} label="Takı"
                options={[
                  { label: 'Yüzük', value: 'RING' }, { label: 'Kolye', value: 'NECKLACE' },
                  { label: 'Bileklik', value: 'BRACELET' }, { label: 'Küpe', value: 'EARRING' },
                  { label: 'Saat', value: 'WATCH' }, { label: 'Diğer', value: 'OTHER' },
                ]}
              />
              <Select label="Başörtüsü" {...register('wearsHeadscarf')}
                options={[
                  { label: 'Seçiniz...', value: '' },
                  { label: 'Kullanıyor', value: 'YES' },
                  { label: 'Kullanmıyor', value: 'NONE' },
                  { label: 'Bilinmiyor', value: 'UNKNOWN' },
                ]}
              />
            </div>

            {/* Section 6: Sağlık */}
            <div className={styles.filterSection}>
              <h4>Sağlık & İletişim</h4>
              <MultiCheckbox name="chronicConditions" control={control} label="Kronik Hastalık"
                options={[
                  { label: 'Diyabet', value: 'DIABETES' }, { label: 'Hipertansiyon', value: 'HYPERTENSION' },
                  { label: 'Kalp Rahatsızlığı', value: 'HEART' }, { label: 'Epilepsi', value: 'EPILEPSY' },
                  { label: 'Astım', value: 'ASTHMA' }, { label: 'Diğer', value: 'OTHER' },
                ]}
              />
              <MultiCheckbox name="spokenLanguages" control={control} label="Konuştuğu Dil"
                options={[
                  { label: 'Türkçe', value: 'TURKISH' }, { label: 'Kürtçe', value: 'KURDISH' },
                  { label: 'Arapça', value: 'ARABIC' }, { label: 'İngilizce', value: 'ENGLISH' },
                  { label: 'İletişim Kurulamıyor', value: 'CANNOT_COMMUNICATE' },
                ]}
              />
            </div>

          </form>
        </aside>

        {/* Right Column: Results */}
        <section className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsTitle}>
              <h2>Arama Sonuçları</h2>
              {hasSearched && !isLoading && (
                <span className={styles.badge}>{results.length} Kayıt Bulundu</span>
              )}
            </div>
            <Button
              type="submit"
              form="searchForm"
              icon={<Search size={18} />}
              isLoading={isLoading}
            >
              Vakaları Ara
            </Button>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.resultsGrid}>
            {!hasSearched && !isLoading && (
              <div className={styles.emptyState}>
                <Search size={48} className={styles.emptyIcon} />
                <h3>Arama Yapın</h3>
                <p>Kayıp yakınınızın fiziksel özelliklerini sol taraftan seçerek arama işlemini başlatın.</p>
              </div>
            )}

            {hasSearched && !isLoading && results.length === 0 && (
              <div className={styles.emptyState}>
                <AlertCircle size={48} className={styles.emptyIcon} />
                <h3>Kayıt Bulunamadı</h3>
                <p>Girdiğiniz kriterlere uygun eşleşen bir vaka sistemde bulunmamaktadır. Daha az filtre kullanarak tekrar deneyebilirsiniz.</p>
              </div>
            )}

            {results.map((result) => (
              <div key={result.victim.id} className={styles.resultCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.scoreCircle}>
                    <svg viewBox="0 0 36 36" className={styles.circularChart}>
                      <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path
                        className={styles.circle}
                        style={{ stroke: result.matchScore >= 75 ? '#22c55e' : result.matchScore >= 50 ? '#f59e0b' : '#ef4444' }}
                        strokeDasharray={`${result.matchScore}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className={styles.percentage}>%{Math.round(result.matchScore)}</text>
                    </svg>
                  </div>
                  <div className={styles.cardTitleArea}>
                    <h3 className={styles.hospitalName}>{result.victim.facilityName || 'Tesis Bilgisi Yok'}</h3>
                    <span className={styles.statusBadge}>
                      {result.victim.province} / {result.victim.district}
                    </span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Cinsiyet / Yaş:</span>
                    <span className={styles.infoValue}>
                      {tr(GENDER_MAP, result.victim.gender)} · {tr(AGE_MAP, result.victim.ageGroup)}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Saç / Göz:</span>
                    <span className={styles.infoValue}>
                      {tr(HAIR_COLOR_MAP, result.victim.hairColor)} · {tr(EYE_MAP, result.victim.eyeColor)}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Sağlık:</span>
                    <span className={styles.infoValue}>{tr(HEALTH_MAP, result.victim.healthStatus)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Kayıt Tarihi:</span>
                    <span className={styles.infoValue}>
                      {result.victim.recordedAt ? new Date(result.victim.recordedAt).toLocaleDateString('tr-TR') : '—'}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Eşleşen Kriter:</span>
                    <span className={styles.infoValue}>{result.matchedCriteriaCount} / {result.totalProvidedCriteriaCount}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Button variant="outline" fullWidth size="sm" onClick={() => setSelectedResult(result)}>
                    Detayları Görüntüle
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      {selectedResult && (
        <DetailModal result={selectedResult} onClose={() => setSelectedResult(null)} />
      )}
    </div>
  );
};
