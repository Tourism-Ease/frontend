// api/package.api.ts
import http from "@/lib/axios";
import type {
  Package,
  PaginatedPackagesResponse,
  PackageResponse,
} from "../types/package.type";

const RESOURCE = "/packages";

// GET paginated packages
export const fetchPaginatedPackages = async (
  page = 1,
  limit = 10,
  keyword?: string
): Promise<PaginatedPackagesResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (keyword) params.keyword = keyword;

  const { data } = await http.get<PaginatedPackagesResponse>(RESOURCE, {
    params,
  });

  return data;
};

// GET all packages
export const fetchPackages = async (): Promise<Package[]> => {
  const { data } = await http.get<Package[]>(RESOURCE);
  return data;
};

// GET package by ID
export const fetchPackageById = async (id: string): Promise<Package> => {
  const { data } = await http.get<PackageResponse>(`${RESOURCE}/${id}`);
  return data.data;
};

// CREATE package
export const createPackage = async (payload: FormData): Promise<Package> => {
  const { data } = await http.post<PackageResponse>(RESOURCE, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data;
};

// UPDATE package
export const updatePackage = async (id: string, payload: FormData): Promise<Package> => {
  const { data } = await http.patch<PackageResponse>(
    `${RESOURCE}/${id}`,
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data.data;
};

// DELETE package
export const deletePackage = async (id: string): Promise<{ message: string }> => {
  const { data } = await http.delete<{ message: string }>(`${RESOURCE}/${id}`);
  return data;
};