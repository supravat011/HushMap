import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Clock, MapPin, Calendar, Volume2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const hourlyData = [
  { hour: "6AM", decibels: 45 },
  { hour: "7AM", decibels: 52 },
  { hour: "8AM", decibels: 68 },
  { hour: "9AM", decibels: 72 },
  { hour: "10AM", decibels: 65 },
  { hour: "11AM", decibels: 63 },
  { hour: "12PM", decibels: 70 },
  { hour: "1PM", decibels: 72 },
  { hour: "2PM", decibels: 68 },
  { hour: "3PM", decibels: 65 },
  { hour: "4PM", decibels: 70 },
  { hour: "5PM", decibels: 78 },
  { hour: "6PM", decibels: 75 },
  { hour: "7PM", decibels: 68 },
  { hour: "8PM", decibels: 60 },
  { hour: "9PM", decibels: 55 },
  { hour: "10PM", decibels: 48 },
];

const weeklyData = [
  { day: "Mon", avg: 65, reports: 45 },
  { day: "Tue", avg: 62, reports: 38 },
  { day: "Wed", avg: 68, reports: 52 },
  { day: "Thu", avg: 64, reports: 41 },
  { day: "Fri", avg: 72, reports: 67 },
  { day: "Sat", avg: 58, reports: 29 },
  { day: "Sun", avg: 52, reports: 22 },
];

const noiseSources = [
  { name: "Traffic", value: 35, color: "#f97316" },
  { name: "Construction", value: 25, color: "#ef4444" },
  { name: "Events", value: 15, color: "#eab308" },
  { name: "Industrial", value: 12, color: "#6366f1" },
  { name: "Other", value: 13, color: "#94a3b8" },
];

const topNoisyLocations = [
  { name: "Downtown Intersection", avgDb: 82, reports: 156, trend: "up" },
  { name: "Industrial District", avgDb: 78, reports: 89, trend: "down" },
  { name: "Main Street Plaza", avgDb: 75, reports: 124, trend: "up" },
  { name: "Highway Junction", avgDb: 74, reports: 67, trend: "stable" },
  { name: "Central Station", avgDb: 72, reports: 98, trend: "down" },
];

const stats = [
  { label: "Avg. City Noise", value: "62 dB", change: "+3%", trend: "up", icon: Volume2 },
  { label: "Reports This Week", value: "294", change: "+12%", trend: "up", icon: BarChart3 },
  { label: "Quiet Zones Found", value: "47", change: "+5", trend: "up", icon: MapPin },
  { label: "Quietest Time", value: "5:30 AM", change: "-", trend: "stable", icon: Clock },
];

export default function Analytics() {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Noise Analytics
            </h1>
            <p className="text-muted-foreground">
              Explore noise patterns and trends across the city
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-noise-loud" />}
                      {stat.trend === "down" && <TrendingDown className="w-4 h-4 text-noise-quiet" />}
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <span className={`text-xs font-medium ${
                        stat.trend === "up" ? "text-noise-loud" : stat.trend === "down" ? "text-noise-quiet" : "text-muted-foreground"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Hourly Pattern */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Daily Noise Pattern
                  </CardTitle>
                  <CardDescription>Average noise levels throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hourlyData}>
                        <defs>
                          <linearGradient id="noiseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(168, 65%, 38%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(168, 65%, 38%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[40, 80]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="decibels"
                          stroke="hsl(168, 65%, 38%)"
                          strokeWidth={2}
                          fill="url(#noiseGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Weekly Overview
                  </CardTitle>
                  <CardDescription>Average noise and report count by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="avg" fill="hsl(168, 65%, 38%)" radius={[4, 4, 0, 0]} name="Avg dB" />
                        <Bar dataKey="reports" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} name="Reports" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Noise Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Noise Sources</CardTitle>
                  <CardDescription>Distribution by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={noiseSources}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {noiseSources.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {noiseSources.map((source) => (
                      <div key={source.name} className="flex items-center gap-1.5 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                        <span className="text-muted-foreground">{source.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Noisy Locations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Noisiest Locations
                  </CardTitle>
                  <CardDescription>Areas with highest reported noise levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topNoisyLocations.map((location, index) => (
                      <div key={location.name} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{location.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{location.reports} reports</span>
                              {location.trend === "up" && <TrendingUp className="w-4 h-4 text-noise-loud" />}
                              {location.trend === "down" && <TrendingDown className="w-4 h-4 text-noise-quiet" />}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(location.avgDb / 100) * 100}%`,
                                  backgroundColor: location.avgDb > 75 ? "hsl(var(--noise-loud))" : "hsl(var(--noise-moderate))",
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium min-w-[50px]">{location.avgDb} dB</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
