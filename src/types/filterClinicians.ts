import clinicians from "../data/clinicians.json";

export type Clinician = (typeof clinicians)[number];

export interface Filters{
    services: string[];
    populationServed: string[];
    cities: string[];
}

export function filterClinicians(list: Clinician[], filters: Filters): Clinician[] {
    return list.filter((c) => {
        if (filters.cities.length > 0 && !filters.cities.includes(c.city)){
            return false;
        }

        if (filters.services.length > 0 && !c.services.some((s) => filters.services.includes(s))){
            return false;
        }

        if (filters.populationServed.length > 0 && !c.populationServed.some((p) => filters.populationServed.includes(p))){
            return false;
        }
        return true;
    });
}