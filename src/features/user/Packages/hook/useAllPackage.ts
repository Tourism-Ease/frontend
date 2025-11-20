import { useQuery } from "@tanstack/react-query";
import { getAllPackages } from "../api/Packages.api";
import type { PackageType } from "../types/Package";

export const useAllPackages = () => {
  return useQuery<PackageType[]>({
    queryKey: ["packages"],
    queryFn: getAllPackages,
  });
};
