import { create } from 'zustand';
import { Diary, CreateDiaryRequest, UpdateDiaryRequest, DiaryQueryParams } from '@/types';
import api from '@/utils/api';

interface DiaryState {
  // データ
  diaries: Diary[];
  currentDiary: Diary | null;
  
  // ページネーション
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // ローディング状態
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // エラー状態
  error: string | null;
  
  // アクション
  fetchDiaries: (params?: DiaryQueryParams) => Promise<void>;
  fetchDiaryById: (id: string) => Promise<void>;
  createDiary: (data: CreateDiaryRequest) => Promise<boolean>;
  updateDiary: (id: string, data: UpdateDiaryRequest) => Promise<boolean>;
  deleteDiary: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentDiary: () => void;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  // 初期状態
  diaries: [],
  currentDiary: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,

  // 日記一覧取得
  fetchDiaries: async (params = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/diaries', { params });
      const { data, pagination } = response.data;
      
      set({
        diaries: data,
        pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || '日記の取得に失敗しました',
        isLoading: false,
      });
    }
  },

  // 個別日記取得
  fetchDiaryById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get(`/diaries/${id}`);
      set({
        currentDiary: response.data.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || '日記の取得に失敗しました',
        isLoading: false,
      });
    }
  },

  // 日記作成
  createDiary: async (data: CreateDiaryRequest) => {
    set({ isCreating: true, error: null });
    
    try {
      const formData = new FormData();
      formData.append('text', data.text);
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await api.post('/diaries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 作成成功後、一覧を更新
      await get().fetchDiaries({ page: 1 });
      
      set({ isCreating: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || '日記の作成に失敗しました',
        isCreating: false,
      });
      return false;
    }
  },

  // 日記更新
  updateDiary: async (id: string, data: UpdateDiaryRequest) => {
    set({ isUpdating: true, error: null });
    
    try {
      const response = await api.put(`/diaries/${id}`, data);
      
      // ローカル状態を更新
      const updatedDiary = response.data.data;
      set((state) => ({
        diaries: state.diaries.map((diary) =>
          diary.id === id ? updatedDiary : diary
        ),
        currentDiary: state.currentDiary?.id === id ? updatedDiary : state.currentDiary,
        isUpdating: false,
      }));
      
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || '日記の更新に失敗しました',
        isUpdating: false,
      });
      return false;
    }
  },

  // 日記削除
  deleteDiary: async (id: string) => {
    set({ isDeleting: true, error: null });
    
    try {
      await api.delete(`/diaries/${id}`);
      
      // ローカル状態から削除
      set((state) => ({
        diaries: state.diaries.filter((diary) => diary.id !== id),
        currentDiary: state.currentDiary?.id === id ? null : state.currentDiary,
        isDeleting: false,
      }));
      
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || '日記の削除に失敗しました',
        isDeleting: false,
      });
      return false;
    }
  },

  // エラークリア
  clearError: () => set({ error: null }),

  // 現在の日記をクリア
  clearCurrentDiary: () => set({ currentDiary: null }),
}));