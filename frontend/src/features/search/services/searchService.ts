import api from '../../../services/api';

export interface VictimSearchCriteria {
  province?: string;
  district?: string;
  gender?: string;
  ageGroup?: string;
  heightRange?: string;
  bodyType?: string;
  skinTone?: string;
  hairColor?: string;
  hairLength?: string;
  hairType?: string;
  eyeColor?: string;
  facialHair?: string;
  hasTattoo?: boolean;
  tattooLocation?: string[];
  tattooShape?: string[];
  hasScar?: boolean;
  scarLocation?: string[];
  hasBirthmark?: boolean;
  birthmarkLocation?: string[];
  prosthetics?: string[];
  wearsGlasses?: string;
  dentalFeatures?: string[];
  jewelry?: string[];
  wearsHeadscarf?: string;
  upperClothingType?: string[];
  lowerClothingType?: string[];
  chronicConditions?: string[];
  spokenLanguages?: string[];
}

export interface DtoVictim {
  id: string;
  caseNumber: string;
  facilityId: string;
  facilityName: string;
  province: string;
  district: string;
  recordedAt: string;
  syncStatus: string;
  gender: string;
  ageGroup: string;
  heightRange: string;
  bodyType: string;
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  hairLength: string;
  hairType: string;
  facialHair: string;
  hasTattoo: boolean;
  tattooLocation: string[];
  tattooShape: string[];
  hasScar: boolean;
  scarLocation: string[];
  hasBirthmark: boolean;
  birthmarkLocation: string[];
  prosthetics: string[];
  wearsGlasses: string;
  dentalFeatures: string[];
  jewelry: string[];
  wearsHeadscarf: string;
  upperClothingType: string[];
  lowerClothingType: string[];
  healthStatus: string;
  consciousness: string;
  chronicConditions: string[];
  spokenLanguages: string[];
  photoUrl: string | null;
}

export interface VictimSearchResult {
  victim: DtoVictim;
  matchScore: number;
  matchedCriteriaCount: number;
  totalProvidedCriteriaCount: number;
}

const searchVictims = async (criteria: VictimSearchCriteria) => {
  const response = await api.post('/victims/search?size=50', criteria);
  const page = response.data.payload;
  // Backend returns a Page object; we extract the content array
  return (page?.content ?? page) as VictimSearchResult[];
};

export const searchService = {
  searchVictims,
};
