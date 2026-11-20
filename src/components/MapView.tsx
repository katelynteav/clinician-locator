import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import ClinicianCard from "./ClinicianCard.tsx";
import type { SelectedClinician } from "../types/SelectedClinician";
import type { Clinician } from "../types/filterClinicians"
import type { FocusRequest } from "../App";
import { formatAddress } from "../types/formatAddress.ts";
import "./MapView.css";
import { getClinicianKey } from "../types/clinicianKey.ts";

declare const __CESIUM_ION_TOKEN__: string;
interface Props {
    clinicians: Clinician[];
    focusRequest: FocusRequest | null;
}

const assetId = "3830184"; // google maps 2d imagery

function MapView({ clinicians, focusRequest }: Props){
    // connecting react & cesium components
    const viewerRef = useRef<Cesium.Viewer | null>(null); // holds Cesium Viewer object so other effects can reach it
    const mapContainer = useRef<HTMLDivElement>(null); // points to <div> Cesium renders into
    const sourceRef = useRef<Cesium.CustomDataSource | null>(null); // holds all clinician pins
    const pinImageRef = useRef<string>(""); // stores pin icon
    const cliniciansRef = useRef(clinicians); // holds the latest clinician prop
    cliniciansRef.current = clinicians;
    const [selected, setSelected] = useState<SelectedClinician | null>(null); // the clinician whose pin was clicked (to display information on clinician card)

    // creates the map 
    useEffect(() => {
        let viewer: Cesium.Viewer | undefined;
        let resizeObserver: ResizeObserver| undefined;
        let disposed = false;

        /** 
         * initializeMap()
         * creates the map w/ Cesium ion token & satellite imagery provider
         * creates Viewer object (creates & manages interactive 2d map in browser)
         * handles map resizing
         * adds imagery layers (satellite layer -> roadmap overlay layer)
         * set up initial camera view over southern california
         * set up pins
         * @returns UI layout & structure for map
         */
        async function initializeMap() {
            const container = mapContainer.current;
            if (!container) return;

            // set Cesium ion access token 
            Cesium.Ion.defaultAccessToken = __CESIUM_ION_TOKEN__;

            // incorporate in a try/catch to prevent crashing if any errors occur
            try {
                // create Google satellite imagery provider
                const satelliteProvider = await Cesium.Google2DImageryProvider.fromIonAssetId({
                        assetId,
                        mapType: "satellite",
                    });

                if (disposed) return;

                // create Cesium viewer
                viewer = new Cesium.Viewer(container, {
                    animation: false,
                    baseLayer: false,
                    baseLayerPicker: false,
                    geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
                    timeline: false,
                    sceneModePicker: false,
                    navigationHelpButton: false,
                    homeButton: false,
                    selectionIndicator: false,
                    infoBox: false,
                });
                viewerRef.current = viewer;

                // resizing map
                requestAnimationFrame(() => viewer?.resize());
                resizeObserver = new ResizeObserver(() => viewer?.resize());
                resizeObserver.observe(container);

                // keep Google geocoder expanded
                viewer.geocoder.viewModel.keepExpanded = true;

                // add imagery layers
                viewer.imageryLayers.addImageryProvider(satelliteProvider as unknown as Cesium.ImageryProvider);
                const labelOverlayProvider = await Cesium.Google2DImageryProvider.fromIonAssetId({
                    assetId,
                    overlayLayerType: "layerRoadmap",
                });
                if (disposed || viewer.isDestroyed()) return;
                viewer.imageryLayers.addImageryProvider(labelOverlayProvider as unknown as Cesium.ImageryProvider)

                // position camera over southern california
                viewer.camera.setView({
                    destination: Cesium.Rectangle.fromDegrees(-121.4827, 32.5342, -115.5152, 35.4655),
                });

                // displaying pins
                const pinBuilder = new Cesium.PinBuilder();
                const pinImage = pinBuilder.fromColor(Cesium.Color.CRIMSON, 35).toDataURL();

                // clinician pins are clustered when zoomed out 
                const clinicianSource = new Cesium.CustomDataSource("clinicians")
                clinicianSource.clustering.enabled = true;
                clinicianSource.clustering.pixelRange = 40;
                clinicianSource.clustering.minimumClusterSize = 3;

                pinImageRef.current = pinImage;
                sourceRef.current = clinicianSource;
                addClinicianEntities(clinicianSource, pinImage, cliniciansRef.current);
                viewer.dataSources.add(clinicianSource);

                // listen for pin clicks to display clinician cards when clicked
                viewer.selectedEntityChanged.addEventListener((entity) => {
                    if (!entity || !entity.properties) {
                        setSelected(null);
                        return;
                    }
                    const props = entity.properties.getValue(viewer!.clock.currentTime);
                    setSelected({
                        title: props.title,
                        address: props.address,
                        contact: props.contact,
                        website: props.website,
                    });
                });

                console.log("Cesium map initialized successfully!");

            } catch (error) {
                console.error("Unable to initialize Cesium:", error);
            }
        }

        void initializeMap();

        // clean up viewer
        return () => {
            disposed = true;
            resizeObserver?.disconnect();
            sourceRef.current = null;
            viewerRef.current = null;

            if (viewer && !viewer.isDestroyed()) {
                viewer.destroy();
            }
        };
    }, []);

    // runs whenever the clinician prop changes (ex: applying filters)
    useEffect(() => {
        if (!sourceRef.current) return; // returns early if data source doesn't exist yet (map is still initializing)
        
        // replace the pins w/ new list
        addClinicianEntities(sourceRef.current, pinImageRef.current, clinicians);
        
        // clears viewer selected entity & sets selected to null so that stale card doesn't linger for a pin that doesn't exist
        if (viewerRef.current && !viewerRef.current.isDestroyed()) {
            viewerRef.current.selectedEntity = undefined;
        }
        setSelected(null);
    }, [clinicians]);

    // runs when App sends a request to focus on a specific clinician (ex: clicking an item from clinician list)
    useEffect(() => {
        const viewer = viewerRef.current;
        const source = sourceRef.current;
        
        // exits early if no requests or viewer/source aren't ready
        if (!focusRequest || !viewer || !source || viewer.isDestroyed()) return;

        const { clinician } = focusRequest;

        // animate to the clinician's coordinates @ 15,000 meters altitude over 1.5 seconds
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(clinician.longitude, clinician.latitude, 15000),
            duration: 1.5,
        })

        // looks up matching entity to display corresponding card
        const entity = source.entities.getById(getClinicianKey(clinician));
        if (entity) viewer.selectedEntity = entity;
    }, [focusRequest]);

    // define UI layout & structure for map
    return (
        <div className="map-view">
            <div ref={mapContainer} className="cesium-map"/>
            <ClinicianCard 
                clinician={selected} 
                onClose={() =>  {
                    if (viewerRef.current) viewerRef.current.selectedEntity = undefined;
                    setSelected(null);
                }}
            />
        </div>
    );
}

/**
 * addClinicianEntities
 * adds entities w/ information
 * @param source 
 * @param pinImage 
 * @param list 
 */
function addClinicianEntities(source: Cesium.CustomDataSource, pinImage: string, list: Clinician[]){
    source.entities.suspendEvents(); // pause change notifications so Cesium doesn't re-render every add/remove pin
    source.entities.removeAll(); // clears existing entities

    // for each clinician, add an entity w/ information
    for (const clinician of list){
        const fullAddress = formatAddress(clinician);

        source.entities.add({
            id: getClinicianKey(clinician),
            name: clinician.name,
            position: Cesium.Cartesian3.fromDegrees(clinician.longitude, clinician.latitude),
            billboard: {
                image: pinImage,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            properties: {
                title: clinician.name,
                address: fullAddress,
                contact: clinician.phone,
                website: clinician.website
            },
        });
    }
    source.entities.resumeEvents(); // re-enables notifications 
}

export default MapView;