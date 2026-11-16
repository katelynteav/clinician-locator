import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import type { Clinician } from "../types/filterClinicians";
import "./ClinicianList.css";

interface Props {
    clinicians: Clinician[];
    onSelect: (clinician: Clinician) => void;
}

/**
 * ClinicianList()
 * displays clinician information in a MUI card
 */
function ClinicianList({ clinicians, onSelect }: Props){
    return (
        <div className="clinician-list">
            {clinicians.map((clinician, index) => (
                <Card key={clinician.name + index} variant="outlined" sx={{ borderRadius: 3, flexShrink: 0, fontFamily:"inherit" }}>
                    <CardActionArea onClick={() => onSelect(clinician)}>
                        <CardContent>
                            <Typography variant="h6" component="h3" sx={{ color: "var(--text-color)", fontWeight: 600, fontFamily:"inherit"}}>
                                {clinician.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Specialty:</strong> {clinician.specialty}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Organization:</strong> {clinician.organization}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ display: "block", mt: 1.5, mb: 0.5}}>
                                <strong>Services</strong>
                            </Typography>
                            <Stack direction="column" useFlexGap spacing={0.5}>
                                {clinician.services.map((service) => (
                                    <Chip key={service} label={service} size="medium" variant="outlined" sx={{ color: "var(--text-color)", borderColor: "var(--text-color)", fontFamily:"inherit"}}/>
                                ))}
                            </Stack>

                            <Typography variant="body2" color="text.secondary" sx={{ display: "block", mt: 1.5, mb: 0.5}}>
                                <strong>Population Served</strong>
                            </Typography>
                            <Stack direction="column" useFlexGap spacing={0.5}>
                                {clinician.populationServed.map((population) => (
                                    <Chip key={population} label={population} size="medium" variant="outlined" sx={{ color: "var(--text-color)", borderColor: "var(--text-color)", fontFamily:"inherit"}}/>
                                ))}
                            </Stack>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
        </div>
    )
}

export default ClinicianList;
