export type BookingType = "Trip" | "Package";

export type Trip = {
    id: string;
    title: string;
    date?: string;
};

export type Package = {
    id: string;
    title: string;
    shortDesc: string;
    durationDays: number;
    hotel: string;
};

export type BookingModalProps = {
    item: Trip | Package;
    bookingType: BookingType;
    onClose: () => void;
};
