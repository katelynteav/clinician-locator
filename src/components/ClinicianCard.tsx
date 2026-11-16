import "./ClinicianCard.css";
import type { SelectedClinician } from "../types/SelectedClinician";

interface Props { 
    clinician: SelectedClinician | null;
    onClose: () => void;
}

/**
 * ClinicianCard()
 * displays overview information of clinician over map when pins are clicked
 */
function ClinicianCard({ clinician, onClose }: Props) {
    if (!clinician) return null; // replaces display: none

    return(
        <div className="clinician-popup">
            <button className="clinician-popup-close" onClick={onClose} aria-label="Close">
                ✕
            </button>
            <h3>{clinician.title}</h3>
            <p>{clinician.address}</p>
                {clinician.contact && <p>{clinician.contact}</p>}
                {clinician.website && (
                    <a href={clinician.website} target="_blank" rel="noopener noreferrer">
                        Website
                    </a>
                )}
        </div>
    );
}

export default ClinicianCard;
