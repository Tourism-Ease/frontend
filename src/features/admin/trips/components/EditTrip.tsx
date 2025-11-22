import { BackButton } from "@/components/admin/BackButton";
import { PageContainer } from "@/components/admin/PageContainer";
import { TripForm } from "./TripForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { useTripByIdQuery, useUpdateTripMutation } from "../hooks/useTrips";

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: trip, isLoading } = useTripByIdQuery(id!);

  const editMutation = useUpdateTripMutation();

  const handleSubmit = (formData: FormData) => {
    if (!id) return;

    toast.loading("Updating trip...", { id: "update-trip" });

    editMutation.mutate(
      { id, payload: formData },
      {
        onSuccess: () => {
          toast.success("Trip updated successfully!", { id: "update-trip" });
          navigate("/admin/trips");
        },
        onError: (err) => {
          toast.error("Failed to update trip.", { id: "update-trip" });
          console.error(err);
        },
      }
    );
  };

  if (isLoading || !trip) {
    return (
      <PageContainer>
        <p>Loading trip...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AdminBreadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Trips", to: "/admin/trips" },
          { label: "Edit" },
        ]}
      />

      <PageHeader
        title={`Edit Trip: ${trip.title}`}
        description="Update the details of this trip."
      />

      <TripForm
        defaultValues={{
          title: trip.title,
          overview: trip.overview,
          destination: trip.destination.id,
          duration: trip.duration,
          pickUp: trip.pickUp,
          egyptianPrice: trip.egyptianPrice,
          foreignerPrice: trip.foreignerPrice,
          childrenPrice: trip.childrenPrice,
          highlights: trip.highlights,
          whatToBring: trip.whatToBring,
          imageCoverUrl: trip.imageCoverUrl,
          imagesUrls: trip.imagesUrls,
        }}
        onSubmit={handleSubmit}
        isLoading={editMutation.isLoading} // ✅ Correct flag
      />

      <BackButton />
    </PageContainer>
  );
}
