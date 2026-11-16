import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type { Filters } from "../types/filterClinicians";

interface MultiSelectProps{
    label: string;
    options: string[];
    value: string[];
    onChange: (value: string[]) => void;
}
/**
 * MultiSelect()
 * allows users select multiple options from dropdown
 */
function MultiSelect({ label, options, value, onChange }: MultiSelectProps){
    return (
        <Autocomplete
            multiple 
            options={options}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            renderInput={(params) => (
                <TextField {...params} label={label} size="small"/>

            )}   
            sx={{minWidth: 250, flex: 1}}     
        />    
    );
}

interface Props {
    filters: Filters;
    onChange: (filters: Filters) => void;
    serviceOptions: string[];
    populationOptions: string[];
    cityOptions: string[];
}

/**
 * ClinicianFilters()
 * displays three multiselect dropdowns
 */
function ClinicianFilters({
    filters,
    onChange,
    serviceOptions,
    populationOptions,
    cityOptions,
}: Props) {
    return (
        <div className="clinician-filters">
            <MultiSelect
                label="Services"
                options={serviceOptions}
                value={filters.services}
                onChange={(services) => onChange({ ...filters, services })}
            />

            <MultiSelect 
                label="Populations Served"
                options={populationOptions}
                value={filters.populationServed}
                onChange={(populationServed) => onChange( {...filters, populationServed})}
            />

            <MultiSelect
                label="City"
                options={cityOptions}
                value={filters.cities}
                onChange={(cities) => onChange({ ...filters, cities })}
            />
        </div>
    );
}

export default ClinicianFilters;