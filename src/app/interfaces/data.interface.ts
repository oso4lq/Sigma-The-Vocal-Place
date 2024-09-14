import { Moment } from "moment";

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
    id: string | number;
    isadmin: boolean;
    name: string;
    img: string;
    email: string;
    telegram: string;
    phone: string;
    seaspass: number; // amount of classes left in the season pass
    classes: []; // array with classes ids created by this user
}

export interface Class {
    id: string | number;
    status: 'confirmed' | "cancelled" | "pending" | "executed";
    startdate: string; // ISO8601 string
    enddate: string; // ISO8601 string
}

export interface TimelineSlot {
    startTime: Moment;
    endTime: Moment;
    status: 'free' | 'occupied';
}