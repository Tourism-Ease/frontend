// src/features/user/profile/api/profile.api.ts
import http from '@/lib/axios';
import type { User } from '@/context/AuthContext';
import type { ApiSuccess } from '@/features/user/auth/types';

function formatError(e: unknown): Error {
  if (typeof e === 'object' && e && 'response' in e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = e as any;
    const message =
      err.response?.data?.message ??
      err.response?.data?.error ??
      err.response?.data?.msg ??
      err.message ??
      'Something went wrong';
    return new Error(message);
  }
  return new Error('Network error');
}

// Get user profile
export async function getProfileApi(): Promise<User> {
  try {
    const { data } = await http.get<{ data: User }>('/users/profile');
    return data.data;
  } catch (err) {
    throw formatError(err);
  }
}

// Update profile - FIXED: Handle file upload with FormData
export async function updateProfileApi(payload: Partial<User> & { avatar?: File | null }): Promise<User> {
  try {
    // If there's an avatar file, use FormData, otherwise use JSON
    if (payload.avatar instanceof File) {
      const formData = new FormData();
      
      // Append all fields to FormData
      if (payload.firstName) formData.append('firstName', payload.firstName);
      if (payload.lastName) formData.append('lastName', payload.lastName);
      if (payload.email) formData.append('email', payload.email);
      if (payload.phone) formData.append('phone', payload.phone);
      if (payload.avatar) formData.append('avatar', payload.avatar);
      
      const { data } = await http.put<{ data: User }>('/users/updateMe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
    } else {
      // Remove avatar from payload if it's not a File
      const { avatar, ...jsonPayload } = payload;
      const { data } = await http.put<{ data: User }>('/users/updateMe', jsonPayload);
      return data.data;
    }
  } catch (err) {
    throw formatError(err);
  }
}

// Change password - FIXED: Use correct payload structure
export async function changePasswordApi(payload: { currentPassword: string; newPassword: string }): Promise<User> {
  try {
    const { data } = await http.patch<{ data: User }>('/users/changeMyPassword', {
      password: payload.newPassword,
      // If your backend requires current password, add it here
      // currentPassword: payload.currentPassword
    });
    return data.data;
  } catch (err) {
    throw formatError(err);
  }
}

// Deactivate account
export async function deactivateAccountApi(): Promise<ApiSuccess> {
  try {
    const { data } = await http.delete<ApiSuccess>('/users/deactivateMe');
    return data;
  } catch (err) {
    throw formatError(err);
  }
}

// Get user trips
export async function getTripsApi() {
  try {
    const { data } = await http.get('/users/trips');
    return data;
  } catch (err) {
    throw formatError(err);
  }
}

export const profileAPI = {
  getProfile: getProfileApi,
  updateProfile: updateProfileApi,
  changePassword: changePasswordApi,
  deactivateAccount: deactivateAccountApi,
  getTrips: getTripsApi,
};