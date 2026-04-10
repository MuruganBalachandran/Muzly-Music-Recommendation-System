//region imports
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Sparkles, Target, Heart, Mail, Github, Linkedin } from "lucide-react";
import LiquidEther from "@/components/animations/LiquidEther";
import ClickSpark from "@/components/animations/ClickSpark";
import { useState } from "react";
import muruganImage from "@/assets/murugan.jpg";
//endregion

//region components
/**
 * Creator Card component with flip animation
 * @param {Object} props - Component props
 * @returns {JSX.Element} CreatorCard component
 */
const CreatorCard = ({ name, role, bio, email, image }: { name: string; role: string; bio: string; email: string; image?: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="h-96 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center p-8 rounded-2xl glass border-2 border-primary/20 hover:border-primary/40 transition-smooth shadow-elegant">
          {image ? (
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 ring-4 ring-primary/30 shadow-float">
              <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-accent shadow-float mb-6 flex items-center justify-center ring-4 ring-primary/30">
              <span className="text-5xl font-bold text-white">{name.charAt(0)}</span>
            </div>
          )}
          <h3 className="text-2xl font-display font-bold mb-2 bg-gradient-accent bg-clip-text text-transparent">{name}</h3>
          <p className="text-muted-foreground font-medium">{role}</p>
          <p className="text-xs text-muted-foreground/60 mt-6 italic">Click to learn more</p>
        </div>
        
        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-gradient-accent text-white shadow-elegant border-2 border-primary-glow/50">
          <h3 className="text-2xl font-display font-bold mb-2">{name}</h3>
          <p className="text-sm opacity-90 mb-6 font-medium">{role}</p>
          <p className="text-sm leading-relaxed mb-6 opacity-95">{bio}</p>
          <div className="flex gap-4 mt-auto">
            <a href={`mailto:${email}`} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-smooth">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-smooth">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-smooth">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * About page component with mission, vision, and team information
 * @returns {JSX.Element} About component
 */
const About = () => {
  //region render
  return (
    <ClickSpark
      sparkColor='#FF9FFC'
      sparkSize={12}
      sparkRadius={20}
      sparkCount={8}
      duration={500}
    >
      <div className="min-h-screen relative w-full">
        <div className="fixed inset-0 -z-10 bg-background">
          <LiquidEther
            colors={['#1a1a1a', '#0f0f0f', '#262626']}
            mouseForce={15}
            cursorSize={80}
            autoDemo={true}
            autoSpeed={0.3}
            autoIntensity={1.5}
          />
        </div>
        <Header />
        <main className="pt-24 pb-12 w-full">
          <div className="w-[90%] mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                About <span className="text-white">Muzly.AI</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Revolutionizing music discovery through visual inspiration
              </p>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass rounded-2xl p-8 shadow-elegant"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-accent shadow-float">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold mb-3">What is Muzly.AI?</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Muzly.AI is a next-generation music recommendation platform that transforms visual moments 
                      into personalized playlists using cutting-edge AI.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass rounded-2xl p-8 shadow-elegant"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-accent shadow-float">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold mb-3">Our Mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      To help people discover music that feels deeply personal — matching emotions, moods, 
                      and moments with remarkable accuracy.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="glass rounded-2xl p-8 shadow-elegant"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-accent shadow-float">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold mb-3">Why It's Unique</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Unlike traditional recommendation systems, Muzly.AI uses image-based emotional understanding, 
                      refined UI, and cinematic gradients to create a premium listening journey.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="glass rounded-2xl p-8 shadow-elegant border-2 border-primary/20"
              >
                <h2 className="text-3xl font-display font-bold mb-8 text-center bg-gradient-accent bg-clip-text text-transparent">Meet the Creators</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <CreatorCard
                    name="Murugan B"
                    role="AI Full Stack Developer"
                    bio="Passionate about building intelligent applications that solve real-world problems. Specializes in full-stack development with AI integration."
                    email="murugan@muzly.ai"
                    image={muruganImage}
                  />
                  <CreatorCard
                    name="Vidhya S"
                    role="GenAI Developer"
                    bio="Expert in generative AI and machine learning. Focused on creating innovative AI-powered experiences for music discovery."
                    email="vidhya@muzly.ai"
                  />
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
    </ClickSpark>
  );
};

export default About;
