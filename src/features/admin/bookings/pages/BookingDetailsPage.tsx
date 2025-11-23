import { useBookingByIdQuery } from "../hooks/useBookings";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { useParams } from "react-router";
import {
  Calendar,
  Users,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { AdminSpinner } from "@/components/ui/Spinner";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { data: booking, isLoading } = useBookingByIdQuery(id!);

  if (isLoading) return <PageContainer><AdminSpinner /></PageContainer>;
  if (!booking) return <PageContainer>No booking found.</PageContainer>;

  const renderStatusBadge = (status: string) => {
    const statusClasses =
      status === "cancelled"
        ? "bg-red-100 text-red-700"
        : status === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700";
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  const formatEGP = (amount: number | null | undefined) => {
    if (amount == null) return null;
    return `${amount.toLocaleString("en-EG")} EGP`;
  };
  const renderCard = (
    icon: JSX.Element,
    label: string,
    value: string | number | null
  ) => {
    if (value == null || value === 0) return null;
    return (
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow">
        {icon}
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-gray-900 font-semibold">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <PageContainer>
      <AdminBreadcrumb
        items={[
          { label: "Bookings", to: "/admin/bookings" },
          { label: "Details" },
        ]}
      />

      {/* Header */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{booking.title}</h1>
          <p className="text-gray-500 mt-1">
            Booking Number:{" "}
            <span className="font-medium">{booking.bookingNumber}</span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {booking.bookingStatus && renderStatusBadge(booking.bookingStatus)}
          {booking.bookingType && (
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              {booking.bookingType}
            </span>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderCard(
          <CreditCard size={24} className="text-blue-500" />,
          "Paid Amount",
          `$${booking.paidAmount || 0}`
        )}
        {renderCard(null, "Total Price", formatEGP(booking.totalPrice))}
        {renderCard(
          null,
          "Remaining Amount",
          formatEGP(booking.remainingAmount)
        )}
        {renderCard(
          <CreditCard size={24} className="text-purple-500" />,
          "Payment Status",
          booking.paymentStatus
        )}
        {renderCard(
          <CreditCard size={24} className="text-gray-500" />,
          "Payment Method",
          booking.paymentMethod
        )}
        {booking.durationDays > 0 &&
          renderCard(
            <Calendar size={24} className="text-blue-500" />,
            "Duration",
            `${booking.durationDays || 0} days`
          )}
        {booking.refundAmount > 0 &&
          renderCard(
            <RefreshCw size={24} className="text-red-500" />,
            "Refund Amount",
            `$${booking.refundAmount}`
          )}
        {booking.refundDate &&
          renderCard(
            <Calendar size={24} className="text-red-500" />,
            "Refund Date",
            new Date(booking.refundDate).toLocaleDateString()
          )}
      </div>

      {/* People Section */}
      {booking.people && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users size={20} /> People
          </h2>
          <div className="flex flex-wrap gap-3 mt-2">
            {booking.people.adults > 0 && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-800 font-medium">
                Adults: {booking.people.adults}
              </span>
            )}
            {booking.people.children > 0 && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-800 font-medium">
                Children: {booking.people.children}
              </span>
            )}
            {booking.people.foreigners > 0 && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-800 font-medium">
                Foreigners: {booking.people.foreigners}
              </span>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
