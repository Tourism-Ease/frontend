import http from "../../../../lib/axios";
import type { PackageType } from "../types/Package";

export const getAllPackages = async (): Promise<PackageType[]> => {
  const res = await http.get("packages");
  return res.data.data;
};
