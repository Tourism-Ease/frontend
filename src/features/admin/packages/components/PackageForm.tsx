// components/PackageForm.tsx
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { XCircle, Plus, Trash2 } from "lucide-react";

import {
    createPackageSchema,
    updatePackageSchema,
    type PackageFormData,
    type UpdatePackageFormData,
} from "../schema/package.schema";
import type { PackageFormDefaultValues } from "../types/package.type";
import { Button } from "@/components/ui/Button";
import {
    useHotelsQuery,
    useDestinationsQuery,
    useTransportationsQuery,
} from "../hooks/useDropdownData";

interface PackageFormProps {
    onSubmit: (fd: FormData) => void;
    isLoading?: boolean;
    defaultValues?: PackageFormDefaultValues;
}

export function PackageForm({
    onSubmit,
    isLoading,
    defaultValues,
}: PackageFormProps) {
    const isEditMode = !!defaultValues;

    // Local state for file handling
    const [coverPreview, setCoverPreview] = useState<string | null>(
        defaultValues?.imageCoverUrl ?? null
    );
    const [imagesPreview, setImagesPreview] = useState<(File | string)[]>(
        defaultValues?.imagesUrls ?? []
    );
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [imagesFiles, setImagesFiles] = useState<File[]>([]);

    // Fetch dropdown data
    const { data: hotels, isLoading: hotelsLoading } = useHotelsQuery();
    const { data: destinations, isLoading: destinationsLoading } =
        useDestinationsQuery();
    const { data: transportations, isLoading: transportationsLoading } =
        useTransportationsQuery();

    // Form setup
    const form = useForm<PackageFormData | UpdatePackageFormData>({
        mode: "onBlur",
        resolver: zodResolver(
            isEditMode ? updatePackageSchema : createPackageSchema
        ),
        defaultValues: {
            title: defaultValues?.title ?? "",
            hotel: defaultValues?.hotel ?? "",
            destination: defaultValues?.destination ?? "",
            durationDays: defaultValues?.durationDays ?? 1,
            shortDesc: defaultValues?.shortDesc ?? "",
            description: defaultValues?.description ?? "",
            egyptianPrice: defaultValues?.egyptianPrice ?? 0,
            childrenPrice: defaultValues?.childrenPrice ?? 0,
            foreignerPrice: defaultValues?.foreignerPrice,
            capacity: defaultValues?.capacity ?? 1,
            departureDate: defaultValues?.departureDate ?? "",
            transportation: defaultValues?.transportation ?? "",
            pickupLocations: defaultValues?.pickupLocations ?? [
                { city: "", place: "", time: "", priceAdjustment: 0 },
            ],
            itinerary: defaultValues?.itinerary ?? [
                { day: 1, title: "", description: "" },
            ],
            imageCover: defaultValues?.imageCoverUrl ?? undefined,
        },
    });

    // Update form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            form.reset({
                title: defaultValues.title ?? "",
                hotel: defaultValues.hotel ?? "",
                destination: defaultValues.destination ?? "",
                durationDays: defaultValues.durationDays ?? 1,
                shortDesc: defaultValues.shortDesc ?? "",
                description: defaultValues.description ?? "",
                egyptianPrice: defaultValues.egyptianPrice ?? 0,
                childrenPrice: defaultValues.childrenPrice ?? 0,
                foreignerPrice: defaultValues.foreignerPrice,
                capacity: defaultValues.capacity ?? 1,
                departureDate: defaultValues.departureDate ?? "",
                transportation: defaultValues.transportation ?? "",
                pickupLocations: defaultValues.pickupLocations ?? [
                    { city: "", place: "", time: "", priceAdjustment: 0 },
                ],
                itinerary: defaultValues.itinerary ?? [
                    { day: 1, title: "", description: "" },
                ],
                imageCover: defaultValues.imageCoverUrl ?? undefined,
            });
        }
    }, [defaultValues, form]);

    // Field arrays for dynamic inputs
    const {
        fields: pickupFields,
        append: appendPickup,
        remove: removePickup,
    } = useFieldArray({
        control: form.control,
        name: "pickupLocations",
    });

    const {
        fields: itineraryFields,
        append: appendItinerary,
        remove: removeItinerary,
    } = useFieldArray({
        control: form.control,
        name: "itinerary",
    });

    // File handlers
    const handleCoverPick = (file?: File) => {
        if (!file) {
            setCoverFile(null);
            setCoverPreview(null);
            form.setValue("imageCover", undefined);
            return;
        }
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
        form.setValue("imageCover", file);
        form.clearErrors("imageCover");
    };

    const handleImagesPick = (files: File[]) => {
        const existingStrings = imagesPreview.filter(
            (x) => typeof x === "string"
        ) as string[];
        const currentFiles = imagesFiles;
        const allowed = Math.max(
            0,
            10 - existingStrings.length - currentFiles.length
        );
        const toAdd = files.slice(0, allowed);
        setImagesFiles((prev) => [...prev, ...toAdd]);
        setImagesPreview((prev) => [...prev, ...toAdd]);
    };

    const removeImageAt = (index: number) => {
        const item = imagesPreview[index];
        const newPreviews = imagesPreview.filter((_, i) => i !== index);
        setImagesPreview(newPreviews);
        
        if (item instanceof File) {
            setImagesFiles((prev) => prev.filter((p) => p !== item));
        }
    };

    // Build FormData for submission
    const buildFormDataAndSubmit = (
        values: PackageFormData | UpdatePackageFormData
    ) => {
        const fd = new FormData();

        // Basic fields
        if (isEditMode) {
            if (values.title) fd.append("title", values.title);
            if (values.hotel) fd.append("hotel", values.hotel);
            if (values.destination) fd.append("destination", values.destination);
            if (values.durationDays) fd.append("durationDays", String(values.durationDays));
            if (values.shortDesc) fd.append("shortDesc", values.shortDesc);
            if (values.description) fd.append("description", values.description);
            if (values.transportation) fd.append("transportation", values.transportation);
            if (values.egyptianPrice) fd.append("egyptianPrice", String(values.egyptianPrice));
            if (values.childrenPrice) fd.append("childrenPrice", String(values.childrenPrice));
            if (values.capacity) fd.append("capacity", String(values.capacity));
            if (values.departureDate) fd.append("departureDate", values.departureDate);
        } else {
            fd.append("title", values.title ?? "");
            fd.append("hotel", values.hotel ?? "");
            fd.append("destination", values.destination ?? "");
            fd.append("durationDays", String(values.durationDays ?? 1));
            fd.append("shortDesc", values.shortDesc ?? "");
            fd.append("description", values.description ?? "");
            fd.append("transportation", values.transportation ?? "");
            fd.append("egyptianPrice", String(values.egyptianPrice ?? 0));
            fd.append("childrenPrice", String(values.childrenPrice ?? 0));
            fd.append("capacity", String(values.capacity ?? 1));
            fd.append("departureDate", values.departureDate ?? "");
        }

        if (values.foreignerPrice !== undefined && values.foreignerPrice !== null) {
            fd.append("foreignerPrice", String(values.foreignerPrice));
        }

        if (values.pickupLocations && values.pickupLocations.length > 0) {
            const pickupLocations = values.pickupLocations.map((location) => ({
                city: location.city,
                place: location.place,
                time: location.time,
                priceAdjustment: location.priceAdjustment || 0,
            }));
            fd.append("pickupLocations", JSON.stringify(pickupLocations));
        }

        if (values.itinerary && values.itinerary.length > 0) {
            const itinerary = values.itinerary.map((day) => ({
                day: day.day,
                title: day.title,
                description: day.description,
            }));
            fd.append("itinerary", JSON.stringify(itinerary));
        }

        if (coverFile instanceof File) {
            fd.append("imageCover", coverFile);
        } else if (typeof values.imageCover === "string" && values.imageCover) {
            fd.append("imageCover", values.imageCover);
        } else if (!isEditMode) {
            form.setError("imageCover", { message: "Cover image is required" });
            return;
        }

        const existingImageUrls = imagesPreview.filter(
            (img) => typeof img === "string"
        ) as string[];
        
        fd.delete("images");
        
        const allImages = [...imagesFiles, ...existingImageUrls];
        allImages.forEach((image) => {
            fd.append("images", image);
        });

        if (allImages.length === 0) {
            fd.append("images", "[]");
        }

        onSubmit(fd);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(buildFormDataAndSubmit)}
                className="space-y-6"
            >
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Package Title *</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter package title" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="durationDays"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (Days) *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value ? parseInt(e.target.value) : 1
                                            )
                                        }
                                        placeholder="Duration in days"
                                        min="1"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Hotel & Destination Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="hotel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hotel *</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    value={field.value}
                                    disabled={hotelsLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={
                                                hotelsLoading ? "Loading hotels..." : "Select a hotel"
                                            } />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {hotels?.map((hotel) => (
                                            <SelectItem key={hotel.id} value={hotel.id}>
                                                {hotel.name} {hotel.stars && `(${hotel.stars}⭐)`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Destination *</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    value={field.value}
                                    disabled={destinationsLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={
                                                destinationsLoading ? "Loading destinations..." : "Select a destination"
                                            } />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {destinations?.map((destination) => (
                                            <SelectItem key={destination.id} value={destination.id}>
                                                {destination.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Transportation Dropdown - FIXED */}
                <FormField
                    control={form.control}
                    name="transportation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transportation *</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                                disabled={transportationsLoading}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={
                                            transportationsLoading ? "Loading transportations..." : "Select transportation"
                                        } />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {transportations?.map((transport) => (
                                        <SelectItem key={transport.id} value={transport.id}>
                                            {transport.companyName} ({transport.type} - {transport.class})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Rest of the form remains the same */}
                <FormField
                    control={form.control}
                    name="shortDesc"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Description *</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Brief description" rows={3} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Description *</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Detailed description"
                                    rows={5}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="egyptianPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Egyptian Price *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value ? parseFloat(e.target.value) : 0
                                            )
                                        }
                                        placeholder="Egyptian Price"
                                        min="0"
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
                                <FormLabel>Children Price *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value ? parseFloat(e.target.value) : 0
                                            )
                                        }
                                        placeholder="Children Price"
                                        min="0"
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
                                <FormLabel>Foreigner Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value ? parseFloat(e.target.value) : undefined
                                            )
                                        }
                                        placeholder="Foreigner Price"
                                        min="0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Capacity & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capacity *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value ? parseInt(e.target.value) : 1
                                            )
                                        }
                                        placeholder="Total capacity"
                                        min="1"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="departureDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Departure Date *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Pickup Locations */}
                <div className="border rounded-lg p-4">
                    <div className="mb-4">
                        <span className="block font-medium text-sm">
                            Pickup Locations *
                        </span>
                        <p className="text-sm text-muted-foreground">
                            At least one pickup location is required
                        </p>
                    </div>

                    {pickupFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border rounded bg-gray-50"
                        >
                            <FormField
                                control={form.control}
                                name={`pickupLocations.${index}.city`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">City *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., Cairo" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`pickupLocations.${index}.place`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Place *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., Airport" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`pickupLocations.${index}.time`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Time *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., 08:00 AM" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`pickupLocations.${index}.priceAdjustment`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Price Adjustment</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ? parseFloat(e.target.value) : 0
                                                    )
                                                }
                                                placeholder="0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removePickup(index)}
                                    disabled={pickupFields.length === 1}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            appendPickup({
                                city: "",
                                place: "",
                                time: "",
                                priceAdjustment: 0,
                            })
                        }
                        className="w-full"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Pickup Location
                    </Button>
                </div>

                {/* Itinerary */}
                <div className="border rounded-lg p-4">
                    <div className="mb-4">
                        <span className="block font-medium text-sm">Itinerary *</span>
                        <p className="text-sm text-muted-foreground">
                            At least one itinerary day is required
                        </p>
                    </div>

                    {itineraryFields.map((field, index) => (
                        <div key={field.id} className="mb-4 p-4 border rounded bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <FormField
                                    control={form.control}
                                    name={`itinerary.${index}.day`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Day *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ? parseInt(e.target.value) : 1
                                                        )
                                                    }
                                                    min="1"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`itinerary.${index}.title`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Activity title" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name={`itinerary.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                rows={3}
                                                placeholder="Detailed description of the day's activities"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeItinerary(index)}
                                className="mt-2"
                                disabled={itineraryFields.length === 1}
                            >
                                <Trash2 size={16} className="mr-1" />
                                Remove Day
                            </Button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            appendItinerary({
                                day: itineraryFields.length + 1,
                                title: "",
                                description: "",
                            })
                        }
                        className="w-full"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Itinerary Day
                    </Button>
                </div>

                {/* Images area: Cover + Additional */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Images</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cover Image */}
                        <div>
                            <span className="block font-medium text-sm mb-2">
                                Cover Image {!isEditMode && "*"}
                            </span>
                            <p className="text-sm text-muted-foreground mb-3">
                                Main image for the package {!isEditMode && "(required)"}
                            </p>

                            {coverPreview ? (
                                <div className="relative w-full max-w-xs rounded overflow-hidden border">
                                    <img
                                        src={coverPreview}
                                        alt="cover"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCoverFile(null);
                                                setCoverPreview(null);
                                                form.setValue("imageCover", undefined);
                                            }}
                                            className="bg-white/80 rounded p-1 hover:bg-white"
                                        >
                                            <XCircle size={18} className="text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="block cursor-pointer">
                                    <div className="flex flex-col items-center justify-center h-48 w-full max-w-xs border-2 border-dashed rounded-md text-muted-foreground hover:border-primary transition-colors p-4">
                                        <Plus size={24} className="mb-2" />
                                        <span className="text-sm text-center">
                                            Upload cover image
                                        </span>
                                        <span className="text-xs text-center mt-1">
                                            {!isEditMode ? "Required" : "Optional"}
                                        </span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) handleCoverPick(f);
                                        }}
                                    />
                                </label>
                            )}

                            {form.formState.errors.imageCover && (
                                <p className="text-sm text-red-600 mt-2">
                                    {form.formState.errors.imageCover.message as string}
                                </p>
                            )}
                        </div>

                        {/* Additional Images */}
                        <div>
                            <span className="block font-medium text-sm mb-2">
                                Additional Images
                            </span>
                            <p className="text-sm text-muted-foreground mb-3">
                                Optional gallery images (max 10)
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {imagesPreview.map((p, i) => (
                                    <div
                                        key={i}
                                        className="relative w-24 h-24 rounded overflow-hidden border"
                                    >
                                        <img
                                            src={
                                                typeof p === "string"
                                                    ? p
                                                    : URL.createObjectURL(p as File)
                                            }
                                            alt={`Package image ${i + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
                                            onClick={() => removeImageAt(i)}
                                            aria-label="Remove image"
                                        >
                                            <XCircle size={16} className="text-red-600" />
                                        </button>
                                    </div>
                                ))}

                                {imagesPreview.length < 10 && (
                                    <label className="cursor-pointer w-24 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground hover:border-primary transition-colors">
                                        <Plus size={20} />
                                        <span className="text-xs mt-1 text-center">Add Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            hidden
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                handleImagesPick(files);
                                            }}
                                        />
                                    </label>
                                )}
                            </div>

                            <p className="text-xs text-muted-foreground mt-2">
                                {imagesPreview.length}/10 images selected
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" disabled={isLoading} className="min-w-32">
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {isEditMode ? "Updating..." : "Creating..."}
                            </div>
                        ) : isEditMode ? (
                            "Update Package"
                        ) : (
                            "Create Package"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}