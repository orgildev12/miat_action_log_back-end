// Database types
export interface AlogTestRecord {
  id: number;
  name: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  total?: number;
  rowsAffected?: number;
}

// Request types
export interface CreateAlogTestRequest {
  name: string;
}

export interface UpdateAlogTestRequest {
  name: string;
}

// Pagination types
export interface PaginationQuery {
  limit?: string;
  offset?: string;
}

// Health check types
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export interface DatabaseTestResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  error?: string;
}
