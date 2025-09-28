export interface Diary {
  id: string;
  text: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDiaryDTO {
  text: string;
  image?: any; // Express.Multer.File
}

export interface UpdateDiaryDTO {
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