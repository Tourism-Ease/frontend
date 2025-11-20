export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin' | 'employee';
  active: boolean;
  isEmailVerified: boolean;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'employee';
}

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin' | 'employee';
  active: boolean;
}

export interface PaginatedUsersResponse {
  data: User[];
  paginationResult: {
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    numberOfPages: number;
  };
}
