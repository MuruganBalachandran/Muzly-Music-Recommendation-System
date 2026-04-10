import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import FloatingLines from "@/components/animations/FloatingLines";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* FloatingLines Animation Background */}
      <div className="absolute inset-0 -z-10">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[10, 15, 20]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 gradient-hero -z-10 opacity-30" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-[90%] mx-auto px-6 py-24">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass shadow-float">
              <Sparkles className="w-4 h-4 text-accent animate-glow" />
              <span className="text-sm font-medium text-muted-foreground">
                AI-Powered Music Discovery
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
              Discover Music{" "}
              <span className="text-white">
                Through Your Eyes
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Our advanced AI analyzes images to understand your mood, aesthetic, and vibe—then recommends the perfect soundtrack for your moment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-base shadow-float transition-smooth hover:shadow-elegant hover:scale-105 bg-gradient-accent text-white font-semibold group"
              >
                Start Exploring
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-smooth" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-base glass shadow-float transition-smooth hover:shadow-elegant hover:scale-105"
              >
                Learn How It Works
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4 justify-center">
              <div>
                <p className="text-3xl font-display font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Songs Analyzed</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-display font-bold text-foreground">10K+</p>
                <p className="text-sm text-muted-foreground">Happy Users</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-display font-bold text-foreground">95%</p>
                <p className="text-sm text-muted-foreground">Match Rate</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
