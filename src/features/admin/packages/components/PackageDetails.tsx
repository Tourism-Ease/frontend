import { Link, useParams, useNavigate } from "react-router";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  Calendar,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Info,
  Images,
  CheckCircle,
} from "lucide-react";

import {
  usePackageByIdQuery,
  useDeletePackageMutation,
} from "../hooks/usePackages";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: pkg, isLoading, isError } = usePackageByIdQuery(id!);
  const deleteMutation = useDeletePackageMutation();

  const handleDelete = () => {
    const toastId = toast.loading("Deleting...");
    deleteMutation.mutate(id!, {
      onSuccess: () => {
        toast.success("Package deleted!", { id: toastId });
        navigate("/admin/packages");
      },
      onError: () => toast.error("Failed to delete package.", { id: toastId }),
    });
  };

  if (isLoading)
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </PageContainer>
    );

  if (isError || !pkg)
    return (
      <PageContainer>
        <p className="text-center py-8 text-muted-foreground">
          Package not found.
        </p>
      </PageContainer>
    );

  return (
    <PageContainer>
      {/* Breadcrumbs */}
      <AdminBreadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Packages", to: "/admin/packages" },
          { label: pkg.title },
        ]}
      />

      {/* Page Header */}
      <PageHeader
        title={pkg.title}
        description={`${pkg.destination.name} • ${pkg.durationDays} days`}
        actions={
          <div className="flex gap-2">
            <Link to={`/admin/packages/edit/${pkg.id}`}>
              <Button className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                <Edit size={16} /> Edit
              </Button>
            </Link>

            <DeleteConfirmationDialog
              itemName={pkg.title}
              onConfirm={handleDelete}
              trigger={
                <Button className="flex items-center gap-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200">
                  <Trash2 size={16} /> Delete
                </Button>
              }
            />
          </div>
        }
      />

      {/* Cover Image */}
      <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow mt-4">
        <img
          src={pkg.imageCoverUrl}
          alt={pkg.title}
          className="w-full h-full object-cover bg-gray-100"
        />
        {/* Duration & Price */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
          <Clock size={16} />
          {pkg.durationDays} days
        </div>
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
          <DollarSign size={16} />
          {formatCurrency(pkg.egyptianPrice)}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <Calendar className="mx-auto mb-2 text-blue-600" size={24} />
          <div className="text-sm text-blue-700">Departure</div>
          <div className="font-semibold">{formatDate(pkg.departureDate)}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <Users className="mx-auto mb-2 text-green-600" size={24} />
          <div className="text-sm text-green-700">Capacity</div>
          <div className="font-semibold">
            {pkg.availableSeats}/{pkg.capacity}
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <Star className="mx-auto mb-2 text-purple-600" size={24} />
          <div className="text-sm text-purple-700">Hotel</div>
          <div className="font-semibold">{pkg.hotel.name}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <MapPin className="mx-auto mb-2 text-orange-600" size={24} />
          <div className="text-sm text-orange-700">Destination</div>
          <div className="font-semibold">{pkg.destination.name}</div>
        </div>
      </div>

      {/* Description */}
      <section className="mt-8 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
          <Info size={20} className="text-green-600" />
          Description
        </h2>
        <p className="text-sm leading-relaxed">{pkg.description}</p>
      </section>

      {/* Short Description */}
      <section className="mt-6 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
          <Info size={20} className="text-blue-600" />
          Overview
        </h2>
        <p className="text-sm leading-relaxed">{pkg.shortDesc}</p>
      </section>

      {/* Pricing */}
      <section className="mt-8 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
          <DollarSign size={20} className="text-green-600" />
          Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg bg-blue-50">
            <div className="text-sm text-blue-600">Egyptian Price</div>
            <div className="text-xl font-bold text-blue-700">
              {formatCurrency(pkg.egyptianPrice)}
            </div>
          </div>
          <div className="text-center p-4 border rounded-lg bg-green-50">
            <div className="text-sm text-green-600">Children Price</div>
            <div className="text-xl font-bold text-green-700">
              {formatCurrency(pkg.childrenPrice)}
            </div>
          </div>
          <div className="text-center p-4 border rounded-lg bg-purple-50">
            <div className="text-sm text-purple-600">Foreigner Price</div>
            <div className="text-xl font-bold text-purple-700">
              {formatCurrency(pkg.foreignerPrice)}
            </div>
          </div>
        </div>
      </section>

      {/* Pickup Locations */}
      {pkg.pickupLocations.length > 0 && (
        <section className="mt-8 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
            <MapPin size={20} className="text-orange-600" />
            Pickup Locations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pkg.pickupLocations.map((location, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="font-semibold">{location.city}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>Place: {location.place}</div>
                  <div>Time: {location.time}</div>
                  <div>
                    Price Adjustment: {formatCurrency(location.priceAdjustment)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Itinerary */}
      {pkg.itinerary.length > 0 && (
        <section className="mt-8 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
            <Calendar size={20} className="text-purple-600" />
            Itinerary
          </h2>
          <div className="space-y-4">
            {pkg.itinerary.map((day, index) => (
              <div
                key={index}
                className="border-l-4 border-purple-500 pl-4 py-2"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-purple-600">
                    Day {day.day}
                  </span>
                  <span className="font-semibold">{day.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {day.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Transportation */}
<section className="mt-8 bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
  <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
    <Users size={20} className="text-blue-600" />
    Transportation
  </h2>
  <div className="text-sm">
    <div>Type: {pkg.transportation?.type || 'N/A'}</div>
    <div>Class: {pkg.transportation?.class || 'N/A'}</div>
    <div>Price: {formatCurrency(pkg.transportation?.price || 0)}</div>
  </div>
</section>

      {/* Image Gallery */}
      {pkg.imagesUrls?.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <Images size={20} className="text-purple-600" />
            Gallery
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pkg.imagesUrls.map((url, idx) => (
              <div
                key={idx}
                className="w-full h-40 rounded-lg overflow-hidden border shadow-sm"
              >
                <img
                  src={url}
                  alt={`Package image ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  );
}
