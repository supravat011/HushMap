import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { MapPin, Loader2, Volume2, Leaf } from "lucide-react";
import { reportsAPI, zonesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/contexts/LocationContext";

interface NoiseReport {
  id: string;
  latitude: number;
  longitude: number;
  noise_category: string;
  decibel_level: number;
  noise_source?: string;
}

interface QuietZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  avg_decibels: number;
  type: string;
}

export default function NoiseMapPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<NoiseReport[]>([]);
  const [zones, setZones] = useState<QuietZone[]>([]);
  const { toast } = useToast();
  const { currentCity } = useLocation();

  useEffect(() => {
    fetchData();
  }, [currentCity]); // Refetch when city changes

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsData, zonesData] = await Promise.all([
        reportsAPI.getAll({ city: currentCity.id, limit: 50 }),
        zonesAPI.getAll({ city: currentCity.id })
      ]);
      setReports(reportsData.reports);
      setZones(zonesData.zones);
    } catch (error) {
      console.error('Failed to fetch map data:', error);
      toast({
        title: "Error loading data",
        description: "Could not load noise reports and quiet zones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getNoiseColor = (category: string) => {
    switch (category) {
      case 'low': return '#2dd4bf';
      case 'medium': return '#fbbf24';
      case 'high': return '#f97316';
      case 'extreme': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${currentCity.bbox.minLng},${currentCity.bbox.minLat},${currentCity.bbox.maxLng},${currentCity.bbox.maxLat}&layer=mapnik&marker=${currentCity.coordinates.lat},${currentCity.coordinates.lng}`;

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MapPin className="w-8 h-8 text-primary" />
              {currentCity.name} Noise Map
            </h1>
            <p className="text-muted-foreground mt-2">
              Explore noise levels and quiet zones across {currentCity.name}
            </p>
          </div>

          <div className="relative w-full h-[600px] rounded-xl overflow-hidden border-2 border-border shadow-lg bg-muted">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              </div>
            )}

            <iframe
              key={currentCity.id}
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              onLoad={() => setLoading(false)}
              title={`${currentCity.name} Noise Map`}
            />
          </div>

          {/* Data Summary Cards */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {/* Noise Reports Card */}
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Noise Reports</h3>
                  <p className="text-sm text-muted-foreground">{reports.length} locations</p>
                </div>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {reports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getNoiseColor(report.noise_category) }}
                      />
                      <span className="text-sm">{report.noise_source || 'Unknown'}</span>
                    </div>
                    <span className="text-sm font-medium">{report.decibel_level} dB</span>
                  </div>
                ))}
                {reports.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{reports.length - 5} more reports
                  </p>
                )}
                {reports.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No noise reports yet for {currentCity.name}
                  </p>
                )}
              </div>
            </div>

            {/* Quiet Zones Card */}
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Quiet Zones</h3>
                  <p className="text-sm text-muted-foreground">{zones.length} peaceful places</p>
                </div>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {zones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-primary" />
                      <span className="text-sm">{zone.name}</span>
                    </div>
                    <span className="text-sm font-medium text-primary">{zone.avg_decibels} dB</span>
                  </div>
                ))}
                {zones.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No quiet zones yet for {currentCity.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-card rounded-lg border border-border">
            <h3 className="font-semibold mb-3">Map Legend</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Noise Levels:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2dd4bf]"></div>
                    <span className="text-sm">Quiet (0-50 dB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#fbbf24]"></div>
                    <span className="text-sm">Moderate (50-70 dB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#f97316]"></div>
                    <span className="text-sm">Loud (70-85 dB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
                    <span className="text-sm">Very Loud (85+ dB)</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Location Types:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-destructive" />
                    <span className="text-sm">Noise Report Locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span className="text-sm">Quiet Zones</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              📍 Total: {reports.length} noise reports and {zones.length} quiet zones in {currentCity.name}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
