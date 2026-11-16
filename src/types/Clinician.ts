export interface Clinician{
    name: string;
    specialty: string;
    organization: string
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    phone: string;
    website: string;
    services: string[];
    populationServed: string[];
}