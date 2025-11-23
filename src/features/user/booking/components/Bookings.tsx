import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import http from "@/lib/axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { FaUsers, FaCalendarAlt, FaDollarSign, FaMoneyBillWave, FaRegClock, FaCreditCard, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Spinner } from "@/components/ui/Spinner";

interface BookingItem {
    _id: string;
    bookingNumber?: string;
    bookingType?: string;
    bookingStatus?: string;
    paymentStatus?: string;
    totalPrice?: number;
    paymentType?: string;
    paidAmount?: number;
    remainingAmount?: number;
    paymentMethod?: string;
    refundAmount?: number;
    item?: {
        title?: string;
        imageCoverUrl?: string;
        duration?: string;
    };
    bookingDate?: string;
    expiresAt?: string;
    createdAt?: string;
    updatedAt?: string;
    people?: { adults?: number; children?: number; infants?: number; foreigners?: number };
}

export default function Bookings() {
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(false);


    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await http.get("/bookings");
            setBookings(res.data?.data || []);
        } catch {
            toast.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await http.patch(`/bookings/${id}/cancel`);
            toast.success("Booking cancelled successfully");
            fetchBookings();
        } catch {
            toast.error("Failed to cancel booking");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Spinner size="lg" />
        </div>
    );

    if (!bookings.length) return <p className="text-center py-10 text-gray-700">You have no bookings yet.</p>;

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-10">My Bookings</h1>

                <div className="max-w-5xl mx-auto grid gap-6">
                    {bookings.map((b) => (
                        <div key={b._id} className="flex flex-col md:flex-row border rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 bg-white">
                            <img
                                src={b.item?.imageCoverUrl ?? "/placeholder.jpg"}
                                alt={b.item?.title ?? "Booking"}
                                className="w-full md:w-40 h-60 md:h-auto object-cover md:rounded-l-xl flex-shrink-0"
                            />
                            <div className="flex-1 p-4 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <h3 className="font-bold text-lg text-indigo-600">Booking #: {b.bookingNumber ?? "-"}</h3>
                                    <h4 className="font-semibold text-gray-800">{b.item?.title ?? "Untitled Booking"}</h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-1"><FaUsers className="text-gray-500" /> People: {b.people?.adults ?? 0} adults, {b.people?.children ?? 0} children, {b.people?.infants ?? 0} infants</div>
                                        <div className="flex items-center gap-1"><FaCalendarAlt className="text-gray-500" /> Date: {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "-"}</div>
                                        <div className="flex items-center gap-1"><FaRegClock className="text-gray-500" /> Expires: {b.expiresAt ? new Date(b.expiresAt).toLocaleDateString() : "-"}</div>
                                        <div className="flex items-center gap-1"><FaDollarSign className="text-gray-500" /> Total: {formatCurrency(b.totalPrice ?? 0)}</div>
                                        <div className="flex items-center gap-1"><FaMoneyBillWave className="text-gray-500" /> Paid: {formatCurrency(b.paidAmount ?? 0)}</div>
                                        <div className="flex items-center gap-1"><FaCreditCard className="text-gray-500" /> Method: {b.paymentMethod ?? "-"}</div>
                                        <div className="flex items-center gap-1">{b.remainingAmount ? <FaTimesCircle className="text-red-500" /> : <FaCheckCircle className="text-green-500" />} Remaining: {formatCurrency(b.remainingAmount ?? 0)}</div>
                                        <div className="flex items-center gap-1">Payment Status: <span className={b.paymentStatus === "pending" ? "text-yellow-600" : "text-green-600"}>{b.paymentStatus ?? "-"}</span></div>
                                        <div className="flex items-center gap-1">Booking Status: <span className={b.bookingStatus === "cancelled" ? "text-red-600" : "text-green-600"}>{b.bookingStatus ?? "-"}</span></div>
                                        <div className="flex items-center gap-1">Refund: {formatCurrency(b.refundAmount ?? 0)}</div>
                                    </div>
                                </div>

                                {b.bookingStatus !== "cancelled" && (
                                    <div className="mt-3 flex justify-end">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleCancel(b._id)}
                                        >
                                            Cancel Booking
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );


}
