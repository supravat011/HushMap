import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Leaf, Loader2, MapPin, TreePine, Building2, School } from "lucide-react";
import { zonesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/contexts/LocationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuietZone {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    avg_decibels: number;
    type: string;
    description?: string;
}

export default function QuietZones() {
    const [loading, setLoading] = useState(true);
    const [zones, setZones] = useState<QuietZone[]>([]);
    const { toast } = useToast();
    const { currentCity } = useLocation();

    useEffect(() => {
        fetchZones();
    }, [currentCity]);

    const fetchZones = async () => {
        try {
            setLoading(true);
            const data = await zonesAPI.getAll({ city: currentCity.id });
            setZones(data.zones);
        } catch (error) {
            console.error('Failed to fetch quiet zones:', error);
            toast({
                title: "Error loading data",
                description: "Could not load quiet zones",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getZoneIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'park':
                return <TreePine className="w-5 h-5" />;
            case 'library':
                return <Building2 className="w-5 h-5" />;
            case 'school':
                return <School className="w-5 h-5" />;
            default:
                return <Leaf className="w-5 h-5" />;
        }
    };

    const getNoiseLevel = (decibels: number) => {
        if (decibels < 40) return { label: "Very Quiet", color: "bg-green-500" };
        if (decibels < 50) return { label: "Quiet", color: "bg-teal-500" };
        if (decibels < 60) return { label: "Moderate", color: "bg-yellow-500" };
        return { label: "Noisy", color: "bg-orange-500" };
    };

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
                            <Leaf className="w-10 h-10 text-primary" />
                            Quiet Zones in {currentCity.name}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Discover peaceful places with low noise levels perfect for relaxation and focus
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Quiet Zones
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{zones.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Average Noise Level
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {zones.length > 0
                                        ? Math.round(zones.reduce((sum, z) => sum + z.avg_decibels, 0) / zones.length)
                                        : 0}{" "}
                                    dB
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Quietest Zone
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold truncate">
                                    {zones.length > 0
                                        ? zones.reduce((min, z) => (z.avg_decibels < min.avg_decibels ? z : min)).name
                                        : "N/A"}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                                <p className="text-muted-foreground">Loading quiet zones...</p>
                            </div>
                        </div>
                    )}

                    {/* Zones Grid */}
                    {!loading && zones.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {zones.map((zone) => {
                                const noiseLevel = getNoiseLevel(zone.avg_decibels);
                                return (
                                    <Card key={zone.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                        {getZoneIcon(zone.type)}
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">{zone.name}</CardTitle>
                                                        <CardDescription className="capitalize">{zone.type}</CardDescription>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Noise Level</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${noiseLevel.color}`} />
                                                        <Badge variant="secondary">{noiseLevel.label}</Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Average</span>
                                                    <span className="font-semibold">{zone.avg_decibels} dB</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>
                                                        {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                                                    </span>
                                                </div>
                                                {zone.description && (
                                                    <p className="text-sm text-muted-foreground pt-2 border-t">
                                                        {zone.description}
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && zones.length === 0 && (
                        <Card className="py-20">
                            <CardContent className="text-center">
                                <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-semibold mb-2">No Quiet Zones Found</h3>
                                <p className="text-muted-foreground">
                                    No quiet zones have been identified in {currentCity.name} yet.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Info Section */}
                    <Card className="mt-8 bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-primary" />
                                About Quiet Zones
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>
                                Quiet zones are designated areas with consistently low noise levels, ideal for
                                activities requiring concentration or relaxation.
                            </p>
                            <p>
                                These zones are identified through community reports and noise monitoring data,
                                helping you find peaceful spots in {currentCity.name}.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
