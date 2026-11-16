import { useState, useMemo } from "react";
import MapView from "./components/MapView";
import ClinicianList from "./components/ClinicianList";
import ClinicianFilters from "./components/ClinicianFilters";
import { filterClinicians } from "./types/filterClinicians";
import type { Clinician, Filters} from "./types/filterClinicians";
import clinicians from "./data/clinicians.json"
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./App.css"

const serviceOptions = [...new Set(clinicians.flatMap((c) => c.services))].sort();
const populationOptions = [...new Set(clinicians.flatMap((c) => c.populationServed))].sort();
const cityOptions = [...new Set(clinicians.flatMap((c) => c.city))].sort();

export interface FocusRequest {
  clinician: Clinician;
  requestId: number;
}

function App(){
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  const handleSelect = (clinician: Clinician) =>
    setFocusRequest({ clinician, requestId: Date.now() });

  const [filters, setFilters] = useState<Filters>({
    services:[],
    populationServed: [],
    cities:[],
  });

  const filtered = useMemo(
    () => filterClinicians(clinicians, filters), 
    [filters]
  );

  return(
    <div className="app">
      <h1>ADHD Clinician Locator</h1>
      <ClinicianFilters
        filters={filters}
        onChange={setFilters}
        serviceOptions={serviceOptions}
        populationOptions={populationOptions}
        cityOptions={cityOptions}
      />

      <div className="content">
        <ClinicianList clinicians={filtered} onSelect={handleSelect}/>
        <div className="map-container">
          <MapView clinicians={filtered} focusRequest={focusRequest}/>
        </div>
      </div>
    </div>
  );
}

export default App;