import http from "../../../../lib/axios";
import type { PackageType } from "../types/Package";

export const getAllPackages = async (): Promise<PackageType[]> => {
  const res = await http.get("packages");
  return res.data.data;
};

// {
//     "results": 3,
//     "paginationResult": {
//         "currentPage": 1,
//         "limit": 50,
//         "numberOfPages": 1,
//         "totalDocs": 3,
//         "next": null,
//         "previous": null
//     },
//     "data": [
//         {
//             "transportation": {
//                 "transport": "69197e51d65d576320b4ea1d",
//                 "price": 1200
//             },
//             "title": "Luxor Historical Escape",
//             "hotel": "691aea8541b83509566ba4f0",
//             "roomTypes": [],
//             "destination": "691adadb2404ffd21031d68e",
//             "pickupPoint": "1/12/2025  3:00 AM Ramses Station ",
//             "durationDays": 4,
//             "shortDesc": "Discover Luxor’s ancient temples and historic sites.",
//             "description": "Experience the Valley of the Kings, Hatshepsut Temple, and a relaxing Nile cruise atmosphere.",
//             "itinerary": [
//                 {
//                     "day": 1,
//                     "title": "Arrival & Check-in",
//                     "description": "Settle into your hotel overlooking the Nile."
//                 },
//                 {
//                     "day": 2,
//                     "title": "Valley of the Kings",
//                     "description": "Visit royal tombs and the Temple of Hatshepsut."
//                 },
//                 {
//                     "day": 3,
//                     "title": "Karnak & Luxor Temple",
//                     "description": "A full day exploring Egypt’s most iconic temples."
//                 },
//                 {
//                     "day": 4,
//                     "title": "Checkout & Return",
//                     "description": "Enjoy a morning walk by the Nile, then return to Cairo."
//                 }
//             ],
//             "imageCover": "tourism-ease/packages/package-f37c198d-33eb-4f56-b4fe-1b50123a4a70-1763372509117-cover",
//             "images": [
//                 "tourism-ease/packages/package-f98d4b31-bd4e-489d-bb22-3cd3bb22c32d-1763372511902-1",
//                 "tourism-ease/packages/package-d02b3538-1d0e-47ff-b7f3-62f438716f3d-1763372511902-2",
//                 "tourism-ease/packages/package-60645fa4-fec2-4ef3-a22e-c23ccf2d3d03-1763372511902-3",
//                 "tourism-ease/packages/package-257d1629-64d6-48e0-acd3-f9f52f5417e9-1763372511903-4",
//                 "tourism-ease/packages/package-3e506d14-3972-4f0b-b7a4-636c2271ca5c-1763372511903-5"
//             ],
//             "basePrice": 9000,
//             "totalPrice": 10200,
//             "createdAt": "2025-11-17T09:41:53.535Z",
//             "updatedAt": "2025-11-17T09:41:53.535Z",
//             "imageCoverUrl": "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-f37c198d-33eb-4f56-b4fe-1b50123a4a70-1763372509117-cover?_a=BAMAMieC0",
//             "imagesUrls": [
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-f98d4b31-bd4e-489d-bb22-3cd3bb22c32d-1763372511902-1?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-d02b3538-1d0e-47ff-b7f3-62f438716f3d-1763372511902-2?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-60645fa4-fec2-4ef3-a22e-c23ccf2d3d03-1763372511902-3?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-257d1629-64d6-48e0-acd3-f9f52f5417e9-1763372511903-4?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-3e506d14-3972-4f0b-b7a4-636c2271ca5c-1763372511903-5?_a=BAMAMieC0"
//             ],
//             "id": "691aede10268ea58398df076"
//         },
//         {
//             "transportation": {
//                 "transport": "69197e51d65d576320b4ea1d",
//                 "price": 400
//             },
//             "title": "Dahab Full Experience – 5 Days",
//             "hotel": "691ae7d03f37daa4ea3dcc58",
//             "roomTypes": [],
//             "destination": "691adae12404ffd21031d691",
//             "pickupPoint": "29/11/2025  4:00 AM Ramses Station ",
//             "durationDays": 5,
//             "shortDesc": "Complete Dahab experience with boat trip and Blue Hole.",
//             "description": "Explore Dahab’s best activities including boat trips, snorkeling, and mountain safari.",
//             "itinerary": [
//                 {
//                     "day": 1,
//                     "title": "Arrival & Check-in",
//                     "description": "Settle in and explore local cafés."
//                 },
//                 {
//                     "day": 2,
//                     "title": "Blue Hole & Snorkeling",
//                     "description": "Discover Dahab’s world-renowned coral reefs."
//                 },
//                 {
//                     "day": 3,
//                     "title": "Boat Trip",
//                     "description": "Full day boat trip with lunch and swimming stops."
//                 },
//                 {
//                     "day": 4,
//                     "title": "Safari Day",
//                     "description": "Jeep safari to Dahab Canyon."
//                 },
//                 {
//                     "day": 5,
//                     "title": "Checkout & Return",
//                     "description": "Return to Cairo."
//                 }
//             ],
//             "imageCover": "tourism-ease/packages/package-6741968f-ee35-4948-aac0-96c068f456b1-1763371256213-cover",
//             "images": [
//                 "tourism-ease/packages/package-a9655631-53c8-4855-a4f1-bff6ec03ba39-1763371258809-1",
//                 "tourism-ease/packages/package-ffd6e14a-7650-4c5b-ac62-f127255ee8c9-1763371258810-2",
//                 "tourism-ease/packages/package-d9d74ab4-13c0-46a5-960a-41a214d33522-1763371258811-3",
//                 "tourism-ease/packages/package-df4aa25f-1a9c-4449-b565-71ecb27b46d4-1763371258813-4",
//                 "tourism-ease/packages/package-26a0abb9-6afa-45e7-969f-49ab059f10c2-1763371258815-5"
//             ],
//             "basePrice": 6000,
//             "totalPrice": 6400,
//             "createdAt": "2025-11-17T09:21:00.444Z",
//             "updatedAt": "2025-11-17T09:21:00.444Z",
//             "imageCoverUrl": "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-6741968f-ee35-4948-aac0-96c068f456b1-1763371256213-cover?_a=BAMAMieC0",
//             "imagesUrls": [
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-a9655631-53c8-4855-a4f1-bff6ec03ba39-1763371258809-1?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-ffd6e14a-7650-4c5b-ac62-f127255ee8c9-1763371258810-2?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-d9d74ab4-13c0-46a5-960a-41a214d33522-1763371258811-3?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-df4aa25f-1a9c-4449-b565-71ecb27b46d4-1763371258813-4?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-26a0abb9-6afa-45e7-969f-49ab059f10c2-1763371258815-5?_a=BAMAMieC0"
//             ],
//             "id": "691ae8fc69119baf0f76287b"
//         },
//         {
//             "transportation": {
//                 "transport": "69197e51d65d576320b4ea1d",
//                 "price": 500
//             },
//             "title": "Dahab Adventure – 3 Days",
//             "hotel": "691ad2c6d4d6f2b097db3f9e",
//             "roomTypes": [],
//             "destination": "691adae12404ffd21031d691",
//             "pickupPoint": "27/11/2025  7:00 AM Ramses Station ",
//             "durationDays": 3,
//             "shortDesc": "3 days in Dahab with Blue Hole visit and snorkeling.",
//             "description": "Enjoy a relaxing 3-day trip in Dahab with snorkeling, beaches, and city tours.",
//             "itinerary": [
//                 {
//                     "day": 1,
//                     "title": "Arrival & Dahab City Tour",
//                     "description": "Check in and explore Dahab city."
//                 },
//                 {
//                     "day": 2,
//                     "title": "Blue Hole Adventure",
//                     "description": "Snorkeling and relaxing at the Blue Hole."
//                 },
//                 {
//                     "day": 3,
//                     "title": "Free Day & Checkout",
//                     "description": "Relaxation day and return to Cairo."
//                 }
//             ],
//             "imageCover": "tourism-ease/packages/package-e8bf59e2-c87e-4062-b787-966a04fa462a-1763369532159-cover",
//             "images": [
//                 "tourism-ease/packages/package-ec6b862c-123a-4e60-aec1-21af097ac542-1763369534510-1",
//                 "tourism-ease/packages/package-aeb3295f-82ca-441b-89f5-324ba920402d-1763369534511-2",
//                 "tourism-ease/packages/package-6578befe-d7d1-4a1e-b623-4485c496fb83-1763369534511-3",
//                 "tourism-ease/packages/package-9976c1bf-e7c1-47ef-8f14-07e251c2e3da-1763369534512-4",
//                 "tourism-ease/packages/package-1d19f79e-1e5c-4c63-ad41-05b7e810bab8-1763369534513-5"
//             ],
//             "basePrice": 4500,
//             "totalPrice": 5000,
//             "createdAt": "2025-11-17T08:52:16.014Z",
//             "updatedAt": "2025-11-17T08:52:16.014Z",
//             "imageCoverUrl": "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-e8bf59e2-c87e-4062-b787-966a04fa462a-1763369532159-cover?_a=BAMAMieC0",
//             "imagesUrls": [
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-ec6b862c-123a-4e60-aec1-21af097ac542-1763369534510-1?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-aeb3295f-82ca-441b-89f5-324ba920402d-1763369534511-2?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-6578befe-d7d1-4a1e-b623-4485c496fb83-1763369534511-3?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-9976c1bf-e7c1-47ef-8f14-07e251c2e3da-1763369534512-4?_a=BAMAMieC0",
//                 "https://res.cloudinary.com/dgpxrx8cp/image/upload/v1/tourism-ease/packages/package-1d19f79e-1e5c-4c63-ad41-05b7e810bab8-1763369534513-5?_a=BAMAMieC0"
//             ],
//             "id": "691ae240db60f510f42c537f"
//         }
//     ]
// }
