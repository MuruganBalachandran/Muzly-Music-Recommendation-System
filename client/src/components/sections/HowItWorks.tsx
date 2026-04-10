import { motion } from "framer-motion";
import { Upload, Cpu, Music, Headphones } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload an Image",
    description: "Choose any photo that reflects your mood or energy. Muzly.AI reads expressions, lighting, and artistic cues.",
    step: "01",
  },
  {
    icon: Cpu,
    title: "AI Analyzes Emotion & Aesthetic",
    description: "Our refined AI engine processes your image with layered depth, soft highlights, and intelligent mood mapping.",
    step: "02",
  },
  {
    icon: Music,
    title: "Get Curated Song Recommendations",
    description: "Receive a playlist tailored to your emotional tone — upbeat, chill, dramatic, calm, or energetic.",
    step: "03",
  },
  {
    icon: Headphones,
    title: "Enjoy & Personalize",
    description: "Listen, save, and refine your music taste inside your Muzly.AI profile.",
    step: "04",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 relative">
      <div className="w-[90%] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
            How <span className="text-white">It Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to discover your perfect soundtrack
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-6 shadow-elegant hover:shadow-float transition-smooth group text-center h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-accent shadow-float flex items-center justify-center">
                    <span className="font-display font-bold text-white">
                      {step.step}
                    </span>
                  </div>
                  
                  <div className="mt-8 mb-4 inline-flex p-5 rounded-2xl bg-muted/50 transition-smooth group-hover:bg-gradient-premium group-hover:scale-110">
                    <step.icon className="w-7 h-7 group-hover:text-white transition-smooth" />
                  </div>
                  
                  <h3 className="text-lg font-display font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
