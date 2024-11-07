declare interface Session {
    title: string;
    abstract: string;
    format: string;
    status: string;
    language: string;
    length?: number;
    postcode: string;
    speakers: Speaker[];
}