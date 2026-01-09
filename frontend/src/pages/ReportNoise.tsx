import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Volume2, Clock, FileText, Send, CheckCircle, Navigation } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { reportsAPI } from "@/services/api";
import { useLocation } from "@/contexts/LocationContext";

const noiseSources = [
  "Traffic",
  "Construction",
  "Music/Events",
  "Industrial",
  "Aircraft",
  "Neighbors",
  "Animals",
  "Other",
];

export default function ReportNoise() {
  const { currentCity } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>({
    lat: currentCity.coordinates.lat,
    lng: currentCity.coordinates.lng
  });
  const [noiseLevel, setNoiseLevel] = useState<string>("medium");
  const [decibels, setDecibels] = useState([65]);
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter coordinates manually.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        toast({
          title: "Location updated",
          description: "Your current location has been set successfully.",
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location access denied",
          description: "Please enable location access or enter coordinates manually.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await reportsAPI.create({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        decibel_level: decibels[0],
        noise_category: noiseLevel,
        noise_source: source || undefined,
        description: description || undefined,
        timestamp: new Date().toISOString(),
      });

      setSubmitted(true);
      toast({
        title: "Report submitted!",
        description: "Thank you for contributing to our noise map.",
      });

      setTimeout(() => {
        setSubmitted(false);
        setSelectedLocation({
          lat: currentCity.coordinates.lat,
          lng: currentCity.coordinates.lng
        });
        setNoiseLevel("medium");
        setDecibels([65]);
        setSource("");
        setDescription("");
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.response?.data?.error || "Could not submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDecibelLabel = (db: number) => {
    if (db < 50) return { text: "Quiet", color: "text-noise-quiet" };
    if (db < 70) return { text: "Moderate", color: "text-noise-moderate" };
    if (db < 85) return { text: "Loud", color: "text-noise-loud" };
    return { text: "Very Loud", color: "text-noise-extreme" };
  };

  const decibelInfo = getDecibelLabel(decibels[0]);

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-noise-quiet/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-noise-quiet" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Report Submitted!</h2>
            <p className="text-muted-foreground">Thank you for contributing to our noise map.</p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">Report Noise</h1>
            <p className="text-muted-foreground">
              Help us map noise pollution by reporting noise levels in {currentCity.name}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Location Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Location
                  </CardTitle>
                  <CardDescription>
                    Enter the coordinates where you experienced the noise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.0001"
                        value={selectedLocation.lat}
                        onChange={(e) => setSelectedLocation({ ...selectedLocation, lat: parseFloat(e.target.value) })}
                        placeholder="11.0168"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.0001"
                        value={selectedLocation.lng}
                        onChange={(e) => setSelectedLocation({ ...selectedLocation, lng: parseFloat(e.target.value) })}
                        placeholder="76.9558"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                  >
                    <Navigation className={`w-4 h-4 mr-2 ${isGettingLocation ? 'animate-pulse' : ''}`} />
                    {isGettingLocation ? "Getting location..." : "Use Current Location"}
                  </Button>

                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium text-primary mb-2">Current Location:</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Tip: Use the button above to get your current location or enter coordinates manually
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-primary" />
                      Noise Details
                    </CardTitle>
                    <CardDescription>
                      Provide information about the noise you're reporting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Noise Level Selection */}
                    <div className="space-y-3">
                      <Label>Noise Level</Label>
                      <RadioGroup value={noiseLevel} onValueChange={setNoiseLevel} className="grid grid-cols-2 gap-3">
                        {[
                          { value: "low", label: "Quiet", color: "border-noise-quiet bg-noise-quiet/10" },
                          { value: "medium", label: "Moderate", color: "border-noise-moderate bg-noise-moderate/10" },
                          { value: "high", label: "Loud", color: "border-noise-loud bg-noise-loud/10" },
                          { value: "extreme", label: "Very Loud", color: "border-noise-extreme bg-noise-extreme/10" },
                        ].map((level) => (
                          <Label
                            key={level.value}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${noiseLevel === level.value ? level.color : "border-border hover:border-muted-foreground/30"
                              }`}
                          >
                            <RadioGroupItem value={level.value} />
                            {level.label}
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Decibel Slider */}
                    <div className="space-y-3">
                      <Label className="flex items-center justify-between">
                        <span>Estimated Decibels</span>
                        <span className={`font-semibold ${decibelInfo.color}`}>
                          {decibels[0]} dB - {decibelInfo.text}
                        </span>
                      </Label>
                      <Slider
                        value={decibels}
                        onValueChange={setDecibels}
                        min={20}
                        max={120}
                        step={5}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>20 dB (Whisper)</span>
                        <span>120 dB (Jet Engine)</span>
                      </div>
                    </div>

                    {/* Noise Source */}
                    <div className="space-y-3">
                      <Label>Noise Source</Label>
                      <div className="flex flex-wrap gap-2">
                        {noiseSources.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSource(s)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${source === s
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Description (Optional)
                      </Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the noise source, duration, or any other relevant details..."
                        rows={3}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isLoading ? "Submitting..." : "Submit Report"}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
