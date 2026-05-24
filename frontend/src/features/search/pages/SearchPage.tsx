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

import { VictimDetailModal, GENDER_MAP, AGE_MAP, HAIR_COLOR_MAP, EYE_MAP, HEALTH_MAP, tr } from '../../../components/VictimDetailModal/VictimDetailModal';

// Detail Modal Extracted

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
                  {result.victim.photoUrl && (
                    <img 
                      src={result.victim.photoUrl} 
                      alt="Thumbnail" 
                      className={styles.cardThumbnail}
                    />
                  )}
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
        <VictimDetailModal 
          victim={selectedResult.victim} 
          matchScore={selectedResult.matchScore}
          matchedCriteriaCount={selectedResult.matchedCriteriaCount}
          totalProvidedCriteriaCount={selectedResult.totalProvidedCriteriaCount}
          onClose={() => setSelectedResult(null)} 
        />
      )}
    </div>
  );
};
