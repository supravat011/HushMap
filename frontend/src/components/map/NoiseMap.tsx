import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface NoiseMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  showMarkers?: boolean;
}

export function NoiseMap({
  center = [40.7128, -74.006],
  zoom = 14,
  height = "500px",
}: NoiseMapProps) {
  return (
    <div style={{ height, width: "100%" }} className="rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
