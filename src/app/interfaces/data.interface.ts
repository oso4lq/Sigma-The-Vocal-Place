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