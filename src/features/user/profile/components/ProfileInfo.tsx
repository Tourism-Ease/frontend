import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import http from "@/lib/axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface BookingItem {
  _id: string;
  bookingNumber?: string;
  bookingType?: string;
  bookingStatus?: string;
  paymentStatus?: string;
  totalPrice?: number;
  item?: {
    title?: string;
    imageCoverUrl?: string;
    duration?: string;
  };
  bookingDate?: string;
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
    } catch (err) {
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
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-700">Loading bookings...</p>;
  if (!bookings.length) return <p className="text-center py-10 text-gray-700">You have no bookings yet.</p>;

  return (<div className="max-w-5xl mx-auto p-6 grid gap-6">
    {bookings.map((b) => (<div key={b._id} className="flex flex-col md:flex-row border rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 bg-white">
      <img
        src={b.item?.imageCoverUrl ?? "/placeholder.jpg"}
        alt={b.item?.title ?? "Booking"}
        className="w-full md:w-40 h-40 object-cover md:rounded-l-xl"
      /> <div className="flex-1 p-4 flex flex-col justify-between"> <div className="space-y-1"> <h3 className="font-bold text-lg">{b.item?.title ?? "Untitled Booking"}</h3> <p className="text-sm text-gray-600">Booking #: {b.bookingNumber ?? "-"}</p> <p className="text-sm text-gray-600">Date: {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "-"}</p> <p className="text-sm text-gray-600">People: {b.people?.adults ?? 0} adults, {b.people?.children ?? 0} children, {b.people?.infants ?? 0} infants, {b.people?.foreigners ?? 0} foreigners</p> <p className="text-sm font-semibold">Total: {formatCurrency(b.totalPrice ?? 0)}</p>
        <p className={`text-sm font-medium ${b.bookingStatus === "cancelled" ? "text-red-600" : "text-green-600"}`}>Status: {b.bookingStatus ?? "Unknown"}</p> </div>
        {b.bookingStatus !== "cancelled" && (<div className="mt-3 flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleCancel(b._id)}
          >
            Cancel Booking </Button> </div>
        )} </div> </div>
    ))} </div>
  );
}
