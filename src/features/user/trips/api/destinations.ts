import http from "@/lib/axios";

// Get all destinations
export async function getAllDestinations() {
    const res = await http.get("/destinations");
    return res.data.data;
}

// Get destination by ID (optional)
export async function getDestinationById(id: string) {
    const res = await http.get(`/destinations/${id}`);
    return res.data.data;
}
