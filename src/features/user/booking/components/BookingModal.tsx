import { useState } from "react";
import http from "../../../../lib/axios";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import type { BookingModalProps } from "../types/booking";

export default function BookingModal({ item, bookingType, onClose }: BookingModalProps) {
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [foreigners, setForeigners] = useState<number>(0);
    const [infants, setInfants] = useState<number>(0);

    const [pickupCity, setPickupCity] = useState<string>(""); // packages only
    const [departureDate, setDepartureDate] = useState<string>(""); // trips only

    const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");

    const [loading, setLoading] = useState<boolean>(false);

    // Generate today's date in local timezone
    const getTodayLocal = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const local = new Date(now.getTime() - offset * 60000);
        return local.toISOString().split("T")[0];
    };

    const today = getTodayLocal();

    // Fetch all bookings for testing
    const fetchBookings = async () => {
        try {
            const res = await http.get("/bookings");
            console.log("All bookings:", res.data.data);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Build payload exactly like Postman
            const payload: Record<string, unknown> = {
                itemId: item.id,
                bookingType,
                paymentType,
                paymentMethod,
                counts: {
                    adults,
                    children,
                    foreigners,
                    infants,
                },
            };

            // Trip: add departureDate
            if (bookingType === "Trip") {
                if (!departureDate) {
                    toast.error("Please select a departure date");
                    setLoading(false);
                    return;
                }

                if (departureDate <= today) {
                    toast.error("Departure date must be after today");
                    setLoading(false);
                    return;
                }

                payload.departureDate = departureDate;
            }

            // Package: add pickupCity
            if (bookingType === "Package") {
                if (!pickupCity.trim()) {
                    toast.error("Please enter a pickup city");
                    setLoading(false);
                    return;
                }
                payload.pickupCity = pickupCity.trim();
            }

            console.log("Booking payload:", payload);

            // Send request with proper headers
            const res = await http.post("/bookings", payload, {
                headers: { "Content-Type": "application/json" }
            });

            if (paymentMethod === "stripe" && res.data?.sessionUrl) {
                window.location.href = res.data.sessionUrl;
                return;
            }

            toast.success("Booking successful!");

            // Fetch all bookings after booking to see update
            await fetchBookings();

            onClose();

        } catch (err) {
            const message = err instanceof Error ? err.message : "An error occurred";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    className="bg-white p-6 rounded-2xl w-full max-w-lg relative"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-xl">
                        <FaTimes />
                    </button>

                    <h2 className="text-3xl font-bold mb-6">Book {bookingType}</h2>

                    {/* People */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <label className="flex flex-col">
                            Adults
                            <input type="number" min={1} value={adults}
                                onChange={(e) => setAdults(Number(e.target.value))}
                                className="border p-2 rounded" />
                        </label>

                        <label className="flex flex-col">
                            Children
                            <input type="number" min={0} value={children}
                                onChange={(e) => setChildren(Number(e.target.value))}
                                className="border p-2 rounded" />
                        </label>

                        <label className="flex flex-col">
                            Foreigners
                            <input type="number" min={0} value={foreigners}
                                onChange={(e) => setForeigners(Number(e.target.value))}
                                className="border p-2 rounded" />
                        </label>

                        <label className="flex flex-col">
                            Infants
                            <input type="number" min={0} value={infants}
                                onChange={(e) => setInfants(Number(e.target.value))}
                                className="border p-2 rounded" />
                        </label>
                    </div>

                    {/* Trip → Departure Date */}
                    {bookingType === "Trip" && (
                        <label className="flex flex-col mb-6">
                            Departure Date
                            <input
                                type="date"
                                min={today}
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                className="border rounded p-2"
                            />
                        </label>
                    )}

                    {/* Package → Pickup City */}
                    {bookingType === "Package" && (
                        <label className="flex flex-col mb-6">
                            Pickup City
                            <input
                                type="text"
                                placeholder="Enter pickup city"
                                value={pickupCity}
                                onChange={(e) => setPickupCity(e.target.value)}
                                className="border rounded p-2"
                            />
                        </label>
                    )}

                    {/* Payment */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <label className="flex flex-col">
                            Payment Type
                            <select
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value as "full" | "deposit")}
                                className="border p-2 rounded"
                            >
                                <option value="full">Full</option>
                                <option value="deposit">Deposit</option>
                            </select>
                        </label>

                        <label className="flex flex-col">
                            Payment Method
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as "cash" | "stripe")}
                                className="border p-2 rounded"
                            >
                                <option value="cash">Cash</option>
                                <option value="stripe">Card (Stripe)</option>
                            </select>
                        </label>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-3 rounded-xl"
                    >
                        {loading ? "Booking..." : "Book Now"}
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
