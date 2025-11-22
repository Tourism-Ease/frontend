import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { XCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { ChipInput } from "@/components/admin/ChipInput"; // reuse the chip input from hotel form
import { createTripSchema, updateTripSchema, type TripFormData } from "../schema/trip.schema";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useDestinationsQuery } from "@/features/admin/destinations/hooks/useDestinations";


interface TripFormProps {
  onSubmit: (fd: FormData) => void;
  isLoading?: boolean;
  defaultValues?: Partial<TripFormData>;
}

export function TripForm({ onSubmit, isLoading, defaultValues }: TripFormProps) {
  const isEditMode = !!defaultValues;

  const { data: destinations, isLoading: isDestinationsLoading } = useDestinationsQuery();



  // Cover image  
  const [coverPreview, setCoverPreview] = useState<string | null>(defaultValues?.imageCoverUrl ?? null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Additional images  
  const [oldImagesUrls, setOldImagesUrls] = useState<string[]>(defaultValues?.imagesUrls ?? []);
  const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<(string | File)[]>([...(oldImagesUrls ?? [])]);

  // Chips  
  const [highlights, setHighlights] = useState<string[]>(defaultValues?.highlights ?? []);
  const [whatToBring, setWhatToBring] = useState<string[]>(defaultValues?.whatToBring ?? []);

  const form = useForm<TripFormData>({
    mode: "onBlur",
    resolver: zodResolver(isEditMode ? updateTripSchema : createTripSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      destination: defaultValues?.destination ? defaultValues.destination : "",
      egyptianPrice: defaultValues?.egyptianPrice ?? undefined,
      childrenPrice: defaultValues?.childrenPrice ?? undefined,
      foreignerPrice: defaultValues?.foreignerPrice ?? undefined,
      duration: defaultValues?.duration ?? "",
      pickUp: defaultValues?.pickUp ?? { time: "", place: "" },
      overview: defaultValues?.overview ?? "",
      highlights: defaultValues?.highlights ?? [],
      whatToBring: defaultValues?.whatToBring ?? [],
    },
  });

  // --- Cover handlers ---  
  const handleCoverPick = (file?: File) => {
    if (!file) { setCoverFile(null); setCoverPreview(null); return; }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // --- Additional images handlers ---  
  const handleImagesPick = (files: File[]) => {
    const totalExisting = imagesPreview.length;
    const allowed = Math.max(0, 5 - totalExisting);
    const toAdd = files.slice(0, allowed);
    setImagesFiles(prev => [...prev, ...toAdd]);
    setImagesPreview(prev => [...prev, ...toAdd]);
  };

  const removeImageAt = (index: number) => {
    const item = imagesPreview[index];
    if (typeof item === "string") setOldImagesUrls(prev => prev.filter(url => url !== item));
    else setImagesFiles(prev => prev.filter(f => f !== item));
    setImagesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const buildFormDataAndSubmit = (values: TripFormData) => {
    console.log("✅ RHF Values:", values);       // all RHF field values
    console.log("Cover file:", coverFile);
    console.log("Images files:", imagesFiles);
    console.log("Old images URLs:", oldImagesUrls);
    console.log("Highlights:", highlights);
    console.log("What to bring:", whatToBring);

    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("destination", values.destination);
    fd.append("egyptianPrice", String(values.egyptianPrice));
    if (values.childrenPrice) fd.append("childrenPrice", String(values.childrenPrice));
    if (values.foreignerPrice) fd.append("foreignerPrice", String(values.foreignerPrice));
    fd.append("duration", values.duration);
    fd.append("pickUp.time", values.pickUp.time);
    fd.append("pickUp.place", values.pickUp.place);
    fd.append("overview", values.overview);

    highlights.forEach(h => fd.append("highlights[]", h));
    whatToBring.forEach(w => fd.append("whatToBring[]", w));

    if (coverFile) fd.append("imageCover", coverFile);
    imagesFiles.forEach(f => fd.append("images", f));
    oldImagesUrls.forEach(url => fd.append("images", url));

    console.log("FormData keys:");
    fd.forEach((value, key) => console.log(key, value));

    console.log(values.destination);

    // Call onSubmit (your API mutation)
    onSubmit(fd);
  };

  // Catch RHF validation errors
  const onError = (errors: any) => {
    console.log("❌ Validation Errors from RHF:", errors);
    toast.error("Fix errors before submitting!");
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(buildFormDataAndSubmit, onError)} className="space-y-6">

        {/* Title + Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name={"title" as FieldPath<TripFormData>} render={({ field }) => (
            <FormItem>
              <FormControl><Input {...field} placeholder="Trip title" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField
            control={form.control}
            name="destination"
            render={({ field, fieldState }) => (
              <FormItem>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val); // updates RHF
                  }}
                >
                  <SelectTrigger className="w-full border-border">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {isDestinationsLoading ? (
                      <SelectItem value="" disabled>Loading...</SelectItem>
                    ) : (
                      destinations?.data?.map(dest => (
                        <SelectItem key={dest.id} value={dest.id}>{dest.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />



        </div>

        {/* Prices + Duration */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="egyptianPrice"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    placeholder="Egyptian Price"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="foreignerPrice"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    placeholder="Foreigner Price"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="childrenPrice"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    placeholder="Children Price"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name={"duration" as FieldPath<TripFormData>} render={({ field }) => (
            <FormItem><FormControl><Input {...field} placeholder="Duration" /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* Pickup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name={"pickUp.time" as FieldPath<TripFormData>} render={({ field }) => (
            <FormItem><FormControl><Input {...field} placeholder="Pickup time" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name={"pickUp.place" as FieldPath<TripFormData>} render={({ field }) => (
            <FormItem><FormControl><Input {...field} placeholder="Pickup place" /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* Overview */}
        <FormField control={form.control} name={"overview" as FieldPath<TripFormData>} render={({ field }) => (
          <FormItem>
            <FormControl><Textarea {...field} rows={4} placeholder="Overview" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Highlights */}
        <FormItem>
          <label className="block mb-1 font-medium text-sm">Highlights</label>
          <ChipInput values={highlights} setValues={setHighlights} placeholder="Add highlight and press Enter" />
        </FormItem>

        {/* What to Bring */}
        <FormItem>
          <label className="block mb-1 font-medium text-sm">What to Bring</label>
          <ChipInput values={whatToBring} setValues={setWhatToBring} placeholder="Add item and press Enter" />
        </FormItem>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cover */}
          <div>
            <label className="block font-medium text-sm">Cover Image *</label>
            {coverPreview ? (
              <div className="relative w-40 h-40 rounded overflow-hidden border">
                <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                <button type="button" className="absolute top-1 right-1 bg-white rounded p-1" onClick={() => { setCoverFile(null); setCoverPreview(null); }}>
                  <XCircle size={18} className="text-red-600" />
                </button>
              </div>
            ) : (
              <label className="block cursor-pointer border-2 border-dashed rounded-md h-32 items-center justify-center text-muted-foreground hover:border-primary flex"  >
                Upload cover
                <input type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) handleCoverPick(f); }} />
              </label>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block font-medium text-sm">Additional Images (max 5)</label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {imagesPreview.map((p, i) => (
                <div key={i} className="relative w-28 h-28 rounded overflow-hidden border">
                  <img src={typeof p === "string" ? p : URL.createObjectURL(p)} alt={`img-${i}`} className="w-full h-full object-cover" />
                  <button type="button" className="absolute top-1 right-1 bg-white rounded p-1" onClick={() => removeImageAt(i)}>
                    <XCircle size={16} className="text-red-600" />
                  </button>
                </div>
              ))}
              {imagesPreview.length < 5 && (
                <label className="cursor-pointer w-28 h-28 border-2 border-dashed rounded-md flex items-center justify-center text-muted-foreground">
                  +
                  <input type="file" accept="image/*" multiple hidden onChange={e => handleImagesPick(Array.from(e.target.files || []))} />
                </label>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>{isEditMode ? "Update Trip" : "Create Trip"}</Button>
      </form>
    </Form>
  );


}
