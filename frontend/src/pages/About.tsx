import { motion } from "framer-motion";
import { Volume2, Heart, Brain, Moon, Users, Target, Shield, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const healthEffects = [
  {
    icon: Heart,
    title: "Cardiovascular Health",
    description: "Chronic noise exposure is linked to increased risk of heart disease, high blood pressure, and stroke.",
  },
  {
    icon: Brain,
    title: "Cognitive Performance",
    description: "Noise pollution impairs concentration, memory, and learning ability, especially in children.",
  },
  {
    icon: Moon,
    title: "Sleep Disruption",
    description: "Even low-level noise during sleep can cause fragmented rest and long-term health issues.",
  },
];

const noiseExamples = [
  { level: "30 dB", example: "Whisper, quiet library", impact: "Comfortable" },
  { level: "50 dB", example: "Moderate rainfall, office", impact: "Low distraction" },
  { level: "70 dB", example: "Vacuum cleaner, traffic", impact: "Hearing damage begins with prolonged exposure" },
  { level: "85 dB", example: "Heavy traffic, loud restaurant", impact: "Risk of hearing damage after 8 hours" },
  { level: "100 dB", example: "Motorcycle, power tools", impact: "Immediate hearing protection required" },
  { level: "120 dB", example: "Ambulance siren, rock concert", impact: "Pain threshold, instant damage possible" },
];

const missionPoints = [
  {
    icon: Target,
    title: "Map Noise Pollution",
    description: "Create comprehensive noise maps through community reporting to identify problem areas.",
  },
  {
    icon: Users,
    title: "Empower Communities",
    description: "Give residents data-driven insights to advocate for quieter neighborhoods.",
  },
  {
    icon: Shield,
    title: "Protect Health",
    description: "Help people make informed decisions about where to live, work, and relax.",
  },
  {
    icon: Lightbulb,
    title: "Drive Change",
    description: "Provide data that policymakers can use to implement noise reduction measures.",
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
              <Volume2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Understanding Noise Pollution
            </h1>
            <p className="text-xl text-muted-foreground">
              Noise pollution is an invisible threat affecting millions of urban residents daily. Learn about its impacts and how HushMap is helping communities find peace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Health Effects */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Health Impacts of Noise</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Excessive noise isn't just annoying—it's a serious public health concern.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {healthEffects.map((effect, index) => {
              const Icon = effect.icon;
              return (
                <motion.div
                  key={effect.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-elegant transition-shadow">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-destructive" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{effect.title}</h3>
                      <p className="text-muted-foreground">{effect.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Noise Level Reference */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Noise Level Reference</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understanding decibel levels and their effects on human health.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            {/* Gradient bar */}
            <div className="mb-8">
              <div className="h-6 rounded-full gradient-noise mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 dB</span>
                <span>50 dB</span>
                <span>85 dB</span>
                <span>120+ dB</span>
              </div>
            </div>

            {/* Examples table */}
            <div className="bg-background rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 font-semibold text-sm">
                <div>Level</div>
                <div>Example</div>
                <div>Impact</div>
              </div>
              {noiseExamples.map((item, index) => (
                <div
                  key={item.level}
                  className={`grid grid-cols-3 gap-4 p-4 ${index % 2 === 0 ? "" : "bg-muted/20"}`}
                >
                  <div className="font-medium">{item.level}</div>
                  <div className="text-muted-foreground">{item.example}</div>
                  <div className="text-sm text-muted-foreground">{item.impact}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              HushMap is on a mission to create quieter, healthier cities through community action and data transparency.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-elegant transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{point.title}</h3>
                      <p className="text-sm text-muted-foreground">{point.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Together, We Can Make Cities Quieter
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Every noise report contributes to a larger picture. By sharing data about noise in your neighborhood, you help identify patterns, support advocacy efforts, and guide urban planning decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/report">
                <Button variant="heroOutline" size="xl">
                  Report Noise Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/map">
                <Button
                  size="xl"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Explore the Map
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tips for Reducing Noise */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Tips for a Quieter Life
            </h2>
            
            <div className="space-y-6">
              {[
                { title: "Use HushMap before moving", desc: "Check noise levels in potential neighborhoods before signing a lease or buying." },
                { title: "Time your outdoor activities", desc: "Use our analytics to find the quietest times for walks, exercise, or outdoor work." },
                { title: "Advocate with data", desc: "Share noise reports with local officials to support noise reduction initiatives." },
                { title: "Protect your hearing", desc: "Use noise-canceling headphones or earplugs in consistently loud environments." },
                { title: "Create quiet spaces", desc: "Use soft furnishings, plants, and white noise to reduce indoor noise impact." },
              ].map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{tip.title}</h3>
                    <p className="text-muted-foreground text-sm">{tip.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
