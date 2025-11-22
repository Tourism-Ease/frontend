export interface DestinationType {
    id: string;
    name: string;
}

export interface Trip {
    id: string;
    title: string;
    destination: DestinationType;
    egyptianPrice: number;
    childrenPrice: number;
    foreignerPrice: number;
    imageCover: string;
    imageCoverUrl: string;
    duration: string;
    pickUp: {
        time: string;
        place: string;
    };
    overview: string;
    images: string[];
    imagesUrls: string[];
    highlights: string[];
    whatToBring: string[];
}
