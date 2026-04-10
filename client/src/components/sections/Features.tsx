import { motion } from "framer-motion";
import { Brain, Image as ImageIcon, Zap, Sparkles, User } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Music Matching",
    description: "Our intelligent engine analyzes your expressions and visual cues to deliver highly personalized song recommendations.",
  },
  {
    icon: ImageIcon,
    title: "Image-Based Mood Detection",
    description: "Upload any image — a selfie, a moment, or a vibe — and let Muzly.AI translate it into the perfect playlist.",
  },
  {
    icon: Zap,
    title: "Lightning-Fast Predictions",
    description: "Enjoy instant recommendations thanks to optimized AI pipelines designed for smooth and responsive playback.",
  },
  {
    icon: Sparkles,
    title: "Minimal, Clean, Premium Interface",
    description: "Crafted with Poppins font, refined spacing, translucent surfaces, soft blur, and clean lines for a luxury user experience.",
  },
  {
    icon: User,
    title: "Personalized Profile System",
    description: "Save your favorite moods, revisit previous uploads, and manage your listening preferences effortlessly.",
  },
];

export const Features = () => {
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
            Powerful Features for <span className="text-white">Music Discovery</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience refined, premium AI-powered music recommendations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass rounded-2xl p-8 shadow-float hover:shadow-elegant transition-smooth group"
            >
              <div className="mb-4 inline-flex p-4 rounded-xl bg-gradient-accent shadow-float transition-smooth group-hover:scale-110 group-hover:glow-accent">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
