import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchService, type VictimSearchCriteria, type VictimSearchResult } from './services/searchService';

interface SearchState {
  results: VictimSearchResult[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean; // to differentiate between empty state vs no results
}

const initialState: SearchState = {
  results: [],
  isLoading: false,
  error: null,
  hasSearched: false,
};

export const executeSearch = createAsyncThunk(
  'search/executeSearch',
  async (criteria: VictimSearchCriteria, thunkAPI) => {
    try {
      // Remove empty or undefined fields so we don't send garbage to backend
      const cleanCriteria = Object.fromEntries(
        Object.entries(criteria).filter(([_, v]) => v != null && v !== '')
      );
      return await searchService.searchVictims(cleanCriteria);
    } catch (error: any) {
      const message = error.response?.data?.errorMessage || 'Arama sırasında bir hata oluştu.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.results = [];
      state.hasSearched = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.hasSearched = true;
      })
      .addCase(executeSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(executeSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
