import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Volume2, Leaf, BarChart3, Users, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import heroImage from "@/assets/hero-quiet-city.jpg";

const features = [
  {
    icon: MapPin,
    title: "Interactive Noise Map",
    description: "Explore real-time noise levels across your city with our color-coded map visualization.",
  },
  {
    icon: Volume2,
    title: "Report Noise",
    description: "Contribute to community data by reporting noise levels at specific locations.",
  },
  {
    icon: Leaf,
    title: "Find Quiet Zones",
    description: "Discover peaceful areas perfect for studying, working, or simply relaxing.",
  },
  {
    icon: BarChart3,
    title: "Noise Analytics",
    description: "View trends and patterns to understand how noise changes over time and location.",
  },
];

const stats = [
  { value: "10K+", label: "Reports Submitted" },
  { value: "500+", label: "Quiet Zones Found" },
  { value: "25", label: "Cities Mapped" },
  { value: "5K+", label: "Active Users" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Peaceful city park"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-hero" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground text-sm font-medium mb-6">
                <Volume2 className="w-4 h-4" />
                Community-Driven Noise Mapping
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
            >
              Find Your Peaceful <br />
              <span className="text-accent">Corner of the City</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-primary-foreground/90 mb-8 max-w-2xl"
            >
              HushMap helps you discover quiet spaces and understand noise patterns in your city through crowdsourced data and interactive maps.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/map">
                <Button variant="hero" size="xl">
                  Explore the Map
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/report">
                <Button variant="heroOutline" size="xl">
                  Report Noise
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary-foreground"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How HushMap Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our community to map noise pollution and discover quiet spaces in your city.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-card border border-border hover:shadow-elegant hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it helps Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Noise Mapping Matters
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Noise pollution affects millions of urban dwellers daily, impacting health, productivity, and quality of life. HushMap empowers communities to understand and address noise issues together.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Users, text: "Community-driven data for accurate insights" },
                  { icon: Shield, text: "Protect your health by avoiding noisy areas" },
                  { icon: Leaf, text: "Find peaceful spots for work and relaxation" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-foreground">{item.text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Learn More About Noise Pollution
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Noise level gradient bar */}
              <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
                <h3 className="text-lg font-semibold mb-6">Understanding Noise Levels</h3>
                <div className="h-4 rounded-full gradient-noise mb-4" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Quiet (&lt;50 dB)</span>
                  <span>Moderate</span>
                  <span>Loud (&gt;85 dB)</span>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-noise-quiet/10 border border-noise-quiet/20">
                    <div className="w-4 h-4 rounded-full bg-noise-quiet" />
                    <div>
                      <div className="font-medium">Library, Quiet Park</div>
                      <div className="text-sm text-muted-foreground">30-50 dB</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-noise-moderate/10 border border-noise-moderate/20">
                    <div className="w-4 h-4 rounded-full bg-noise-moderate" />
                    <div>
                      <div className="font-medium">Normal Conversation, Office</div>
                      <div className="text-sm text-muted-foreground">50-70 dB</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-noise-loud/10 border border-noise-loud/20">
                    <div className="w-4 h-4 rounded-full bg-noise-loud" />
                    <div>
                      <div className="font-medium">Busy Traffic, Loud Music</div>
                      <div className="text-sm text-muted-foreground">70-85 dB</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-noise-extreme/10 border border-noise-extreme/20">
                    <div className="w-4 h-4 rounded-full bg-noise-extreme" />
                    <div>
                      <div className="font-medium">Construction, Concerts</div>
                      <div className="text-sm text-muted-foreground">&gt;85 dB</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Find Your Quiet Space?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users mapping noise in their cities and discovering peaceful places.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button variant="heroOutline" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/map">
                <Button
                  size="xl"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  View the Map
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
