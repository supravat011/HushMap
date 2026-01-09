import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon issue
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
}

// Sample noise data
const sampleData = [
    { id: 1, lat: 40.7128, lng: -74.006, level: "high", db: 85, source: "Traffic" },
    { id: 2, lat: 40.7580, lng: -73.9855, level: "medium", db: 65, source: "Construction" },
    { id: 3, lat: 40.7489, lng: -73.9680, level: "low", db: 45, source: "Park" },
];

const getColor = (level: string) => {
    switch (level) {
        case "low": return "#2dd4bf";
        case "medium": return "#fbbf24";
        case "high": return "#f97316";
        case "extreme": return "#ef4444";
        default: return "#94a3b8";
    }
};

export default function NoiseMapClient() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-full h-full flex items-center justify-center">
            <p>Initializing map...</p>
        </div>;
    }

    return (
        <MapContainer
            center={[40.7128, -74.006]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {sampleData.map((point) => (
                <CircleMarker
                    key={point.id}
                    center={[point.lat, point.lng]}
                    radius={15}
                    pathOptions={{
                        color: getColor(point.level),
                        fillColor: getColor(point.level),
                        fillOpacity: 0.6,
                        weight: 2,
                    }}
                >
                    <Popup>
                        <div className="p-2">
                            <p className="font-semibold">{point.level.toUpperCase()}</p>
                            <p className="text-sm">{point.db} dB</p>
                            <p className="text-sm text-gray-600">{point.source}</p>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}
