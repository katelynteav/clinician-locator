import type { Clinician } from "../types/filterClinicians";

export function getClinicianKey(c: Clinician){
    return `${c.name}|${c.latitude}|${c.longitude}`;
}