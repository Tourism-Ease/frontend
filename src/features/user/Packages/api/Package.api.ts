import http from "../../../../lib/axios";
import type { PackageType } from "../types/Package";

export const getPackage = async (id: string): Promise<PackageType> => {
    const res = await http.get(`/packages/${id}`);
    return res.data.data;
};
