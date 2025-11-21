import PackageList from "../components/PackageList";
import { useAllPackages } from "../hook/useAllPackage";
import type { PackageType } from "../types/Package";

export default function PackagesPage() {
  const { data: packages, isLoading } = useAllPackages();
  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div className="mt-20 mb-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages?.map((pkg: PackageType) => (
          <PackageList
            key={pkg.id}
            id={pkg.id}
            title={pkg.title}
            shortDesc={pkg.shortDesc}
            durationDays={pkg.durationDays}
            imageCoverUrl={pkg.imageCoverUrl}
            images={pkg.images}
          />
        ))}
      </div>
    </>
  );
}
