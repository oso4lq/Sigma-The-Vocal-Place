export interface Card {
    id: number;
    title: string;
    image: string;
    contentShort: string;
    contentLong: string;
}

export interface Review extends Card {
    user: string;
    source: Source;
    rating: number;
}

export interface Source {
    id: number;
    name: string;
    logo: string;
}

export interface User {
    id: number;
    isadmin: boolean;
    name: string;
    img: string;
    mail: string;
    telegram: string;
    phone: string;
    seaspass: number; // amount of classes left in the season pass
    classes: [];
}

export interface Booking {
    id: number;
    status: 'confirmed' | "cancelled" | "pending" | "executed";
    date: string;
}