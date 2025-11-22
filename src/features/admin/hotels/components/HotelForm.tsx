import React, { useState } from "react";
<<<<<<< HEAD
import { useForm, type FieldPath } from "react-hook-form";
=======
import { useForm, Controller, type FieldPath } from "react-hook-form";
>>>>>>> 4dd052fc99ba24b1477e4abad02f5623e00a78c2
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { XCircle } from "lucide-react";

import {
    createHotelSchema,
    updateHotelSchema,
    type HotelFormData,
    type UpdateHotelFormData,
} from "../schema/hotel.schema";
import type { CreateHotelDto, UpdateHotelDto } from "../types/hotel.type";
import { LocationAutocomplete } from "./LocationAutoComplete";
import { MapPreview } from "./MapPreview";

<<<<<<< HEAD
=======
/**
 * HotelForm
 * - onSubmit receives FormData ready to send to your backend
 * - defaultValues may contain existing imageCoverUrl (string) and imagesUrls (string[])
 *
 * Notes:
 * - backend expects address as an object; we append address as JSON string under key "address"
 * - propertyHighlights[] appended as multiple keys "propertyHighlights[]"
 * - location appended as JSON string under key "location"
 * - imageCover: either File (new upload) or string (existing public id/url)
 * - images: mixture of File and string (existing)
 *
 * If your Zod schema still requires imageCover/images to be string URLs, update them to accept File | string to avoid client validation errors.
 */

>>>>>>> 4dd052fc99ba24b1477e4abad02f5623e00a78c2
interface HotelFormProps {
    onSubmit: (fd: FormData) => void;
    isLoading?: boolean;
    defaultValues?: Partial<UpdateHotelDto> | Partial<CreateHotelDto>;
}

export function HotelForm({ onSubmit, isLoading, defaultValues }: HotelFormProps) {
    const isEditMode = !!defaultValues;
    const editDefaults = (defaultValues as Partial<UpdateHotelDto>) ?? undefined;

    // Cover image
    const [coverPreview, setCoverPreview] = useState<string | null>(
        editDefaults?.imageCoverUrl ?? null
    );
    const [coverFile, setCoverFile] = useState<File | null>(null);

    // Old images (URLs from backend)
    const [oldImagesUrls, setOldImagesUrls] = useState<string[]>(
        Array.isArray(editDefaults?.imagesUrls) ? editDefaults.imagesUrls : []
    );

    // New images uploaded this session
    const [imagesFiles, setImagesFiles] = useState<File[]>([]);

    // Preview array (mixed: old URLs + new File objects)
    const [imagesPreview, setImagesPreview] = useState<(string | File)[]>(
        [...(oldImagesUrls ?? [])]
    );

    // Property highlights
    const [propertyHighlights, setPropertyHighlights] = useState<string[]>(
        defaultValues?.propertyHighlights ?? []
    );

    // Location
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
        defaultValues?.location
            ? { lat: defaultValues.location.coordinates[1], lng: defaultValues.location.coordinates[0] }
            : null
    );

    const form = useForm<HotelFormData | UpdateHotelFormData>({
        mode: "onBlur",
        resolver: zodResolver(isEditMode ? updateHotelSchema : createHotelSchema),
        defaultValues: {
            name: defaultValues?.name ?? "",
            description: defaultValues?.description ?? "",
            stars: defaultValues?.stars ?? 1,
            address: {
                country: defaultValues?.address?.country ?? "",
                city: defaultValues?.address?.city ?? "",
                street: defaultValues?.address?.street ?? "",
            },
            propertyHighlights: defaultValues?.propertyHighlights ?? [], // <-- add this
        },
    });

    // --- ChipInput component ---
    function ChipInput({ values, setValues, placeholder }: { values: string[]; setValues: (v: string[]) => void; placeholder?: string; }) {
        const [text, setText] = useState("");
        const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && text.trim()) {
                e.preventDefault();
                if (!values.includes(text.trim())) setValues([...values, text.trim()]);
                setText("");
            }
        };
        const remove = (v: string) => setValues(values.filter((x) => x !== v));
        return (
            <div className="flex flex-wrap gap-2 border p-2 rounded">
                {values.map((v) => (
                    <span key={v} className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                        <span className="text-sm">{v}</span>
                        <XCircle size={16} className="cursor-pointer" onClick={() => remove(v)} />
                    </span>
                ))}
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder ?? "Press Enter to add"}
                    className="flex-1 outline-none p-1 min-w-[120px]"
                />
            </div>
        );
    }

    // --- Cover handlers ---
    const handleCoverPick = (file?: File) => {
        if (!file) {
            setCoverFile(null);
            setCoverPreview(null);
            return;
        }
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    // --- Images handlers ---
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
        else if (item instanceof File) setImagesFiles(prev => prev.filter(f => f !== item));
        setImagesPreview(prev => prev.filter((_, i) => i !== index));
    };

    // --- Submit ---
    const buildFormDataAndSubmit = (values: HotelFormData | UpdateHotelFormData) => {
        const fd = new FormData();
        fd.append("name", values.name ?? "");
        fd.append("description", values.description ?? "");
        fd.append("stars", String(values.stars ?? 1));

        if (values.address) {
            fd.append("address.country", values.address.country);
            fd.append("address.city", values.address.city);
            fd.append("address.street", values.address.street ?? '');
        }

        // propertyHighlights.forEach(h => fd.append("propertyHighlights[]", h));
        (values.propertyHighlights ?? []).forEach(h => fd.append("propertyHighlights[]", h));


        if (location) {
            fd.append("location.type", 'Point');
            fd.append("location.coordinates[]", String(location.lng));
            fd.append("location.coordinates[]", String(location.lat));
        }

        if (coverFile instanceof File) fd.append("imageCover", coverFile);
        else if (typeof coverPreview === "string" && coverPreview) fd.append("imageCover", coverPreview);

        imagesFiles.forEach(f => fd.append("images", f));
        oldImagesUrls.forEach(url => fd.append("images", url));

        onSubmit(fd);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(buildFormDataAndSubmit)} className="space-y-6">
                {/* Name + Stars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name={"name" as FieldPath<HotelFormData | UpdateHotelFormData>}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder="Hotel name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"stars" as FieldPath<HotelFormData | UpdateHotelFormData>}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} type="number" min={1} max={5} onChange={e => field.onChange(Number(e.target.value))} placeholder="Stars (1-5)" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name={"address.country" as FieldPath<HotelFormData | UpdateHotelFormData>} render={({ field }) => (
                        <FormItem>
                            <FormControl><Input {...field} placeholder="Country" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name={"address.city" as FieldPath<HotelFormData | UpdateHotelFormData>} render={({ field }) => (
                        <FormItem>
                            <FormControl><Input {...field} placeholder="City" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name={"address.street" as FieldPath<HotelFormData | UpdateHotelFormData>} render={({ field }) => (
                        <FormItem>
                            <FormControl><Input {...field} placeholder="Street (optional)" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                {/* Highlights */}
                <FormField
                    control={form.control}
                    name={"propertyHighlights" as FieldPath<HotelFormData | UpdateHotelFormData>}
                    render={({ field }) => (
                        <FormItem>
                            <label className="block mb-1 font-medium text-sm">Property Highlights</label>
                            <ChipInput
                                values={field.value ?? []}
                                setValues={(v) => field.onChange(v)}
                                placeholder="Add highlight and press Enter"
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Description */}
                <FormField control={form.control} name={"description" as FieldPath<HotelFormData | UpdateHotelFormData>} render={({ field }) => (
                    <FormItem>
                        <label className="block mb-1 font-medium text-sm">Description</label>
                        <FormControl><Textarea {...field} placeholder="Description" rows={4} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {/* Location */}
                <div className="space-y-2">
                    <label className="block font-medium text-sm">Location</label>
                    <LocationAutocomplete location={location} setLocation={loc => {
                        setLocation(loc);
                        form.setValue("location" as any, loc ? { type: "Point", coordinates: [loc.lng, loc.lat] } : undefined);
                    }} />
                    {location && <MapPreview lat={location.lat} lng={location.lng} height="220px" />}
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cover */}
                    <div>
                        <label className="block font-medium text-sm">Cover Image {!(editDefaults?.imageCoverUrl) && "*"}</label>
                        {coverPreview ? (
                            <div className="relative w-40 h-40 rounded overflow-hidden border">
                                <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }} className="bg-white/80 rounded p-1">
                                        <XCircle size={18} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="block">
                                <div className="cursor-pointer flex items-center justify-center h-32 w-full border-2 border-dashed rounded-md text-sm text-muted-foreground hover:border-primary p-2">
                                    Upload cover
                                </div>
                                <input type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) handleCoverPick(f); }} />
                            </label>
                        )}
                        <div className="mt-2 flex gap-2">
                            <label className="cursor-pointer text-sm underline" onClick={() => {
                                const ip = document.createElement("input");
                                ip.type = "file"; ip.accept = "image/*";
                                ip.onchange = (ev: any) => { const f = ev.target.files?.[0]; if (f) handleCoverPick(f); };
                                ip.click();
                            }}>Replace cover</label>
                            {coverPreview && <button type="button" className="text-sm underline" onClick={() => { setCoverFile(null); setCoverPreview(null); }}>Remove</button>}
                        </div>
                    </div>

                    {/* Additional images */}
                    <div>
                        <label className="block font-medium text-sm">Additional Images (max 5)</label>
                        <div className="mt-2 flex gap-2 flex-wrap">
                            {imagesPreview.map((p, i) => (
                                <div key={i} className="relative w-28 h-28 rounded overflow-hidden border">
                                    <img src={typeof p === "string" ? p : URL.createObjectURL(p)} alt={`img-${i}`} className="w-full h-full object-cover" />
                                    <button type="button" className="absolute top-1 right-1 bg-white rounded p-1" onClick={() => removeImageAt(i)} aria-label="Remove image">
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

                <div>
                    <Button type="submit" disabled={isLoading}>{isEditMode ? "Update Hotel" : "Create Hotel"}</Button>
                </div>
            </form>
        </Form>
    );
}
