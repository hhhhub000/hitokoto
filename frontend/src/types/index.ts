export interface Diary {
  id: string;
  text: string;
  imageUrl?: string;
  createdAt: string; // ISO string format from API
  updatedAt: string; // ISO string format from API
}

export interface CreateDiaryRequest {
  text: string;
  image?: File;
}

export interface UpdateDiaryRequest {
  text: string;
}

export interface DiaryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DiaryListResponse extends ApiResponse<Diary[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}