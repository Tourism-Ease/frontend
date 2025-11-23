import { useState } from "react";
import http from "../../../../lib/axios";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import type { BookingModalProps } from "../types/booking";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // ShadCN Input
import { useNavigate } from "react-router";

export default function BookingModal({ item, bookingType, onClose }: BookingModalProps) {
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [foreigners, setForeigners] = useState<number>(0);
    const [infants, setInfants] = useState<number>(0);
    const [pickupCity, setPickupCity] = useState<string>("");
    const [departureDate, setDepartureDate] = useState<string>("");
    const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();


    const getTomorrowLocal = () => {
        const now = new Date();
        now.setDate(now.getDate() + 1); // move to tomorrow
        const offset = now.getTimezoneOffset();
        const local = new Date(now.getTime() - offset * 60000);
        return local.toISOString().split("T")[0];
    };

    const tomorrow = getTomorrowLocal();


    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload: Record<string, unknown> = {
                itemId: item.id,
                bookingType,
                paymentType,
                paymentMethod,
                counts: { adults, children, foreigners, infants },
            };
            if (bookingType === "Trip") {
                if (!departureDate) { toast.error("Please select a departure date"); setLoading(false); return; }
                if (departureDate < tomorrow) { toast.error("Departure date must be tomorrow or later"); setLoading(false); return; }
                payload.departureDate = departureDate;
            }
            if (bookingType === "Package") {
                if (!pickupCity.trim()) { toast.error("Please enter a pickup city"); setLoading(false); return; }
                payload.pickupCity = pickupCity.trim();
            }

            console.log("Booking payload:", payload);
            const res = await http.post("/bookings", payload, { headers: { "Content-Type": "application/json" } });
            if (paymentMethod === "stripe" && res.data?.sessionUrl) {
                window.location.href = res.data.sessionUrl;
                return;
            }
            toast.success("Booking successful!");

            navigate('/bookings');
            onClose();
        } catch (err) {
            const message = err instanceof Error ? err.message : "An error occurred";
            toast.error(message);
        } finally { setLoading(false); }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    className="bg-white p-6 rounded-2xl w-full max-w-lg relative"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-xl cursor-pointer"><FaTimes /></button>
                    <h2 className="text-3xl font-bold mb-6">Book {bookingType}</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <label className="flex flex-col">
                            Adults
                            <Input type="number" min={1} value={adults} onChange={(e) => setAdults(Number(e.target.value))} />
                        </label>
                        <label className="flex flex-col">
                            Children
                            <Input type="number" min={0} value={children} onChange={(e) => setChildren(Number(e.target.value))} />
                        </label>
                        <label className="flex flex-col">
                            Foreigners
                            <Input type="number" min={0} value={foreigners} onChange={(e) => setForeigners(Number(e.target.value))} />
                        </label>
                        <label className="flex flex-col">
                            Infants
                            <Input type="number" min={0} value={infants} onChange={(e) => setInfants(Number(e.target.value))} />
                        </label>
                    </div>

                    {bookingType === "Trip" && (
                        <label className="flex flex-col mb-6">
                            Departure Date
                            <Input type="date" min={tomorrow} value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
                        </label>
                    )}

                    {bookingType === "Package" && (
                        <div className="mb-6">
                            <label className="block mb-2 font-medium">Pickup City</label>
                            <Select value={pickupCity} onValueChange={setPickupCity}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                                <SelectContent>
                                    {item.pickupLocations.map((loc, idx) => (
                                        <SelectItem key={idx} value={loc.city}>
                                            {loc.city} - {loc.place} ({loc.time})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium">Payment Type</label>
                            <Select value={paymentType} onValueChange={(val) => setPaymentType(val as "full" | "deposit")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select payment type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full">Full</SelectItem>
                                    <SelectItem value="deposit">Deposit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium">Payment Method</label>
                            <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as "cash" | "stripe")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="stripe">Card (Stripe)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-500 text-white py-3 rounded-xl cursor-pointer hover:bg-blue-600 hover:shadow-md transition duration-300" > {loading ? "Booking..." : "Book Now"} </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );


}
