import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen gap-8 px-6"
    >
      <div className="text-center space-y-4">
        <h1 className="text-6xl md:text-8xl font-display font-bold text-white">404</h1>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
          Oops! Page not found
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Button
        onClick={() => navigate('/')}
        className="px-8 py-3 bg-gradient-accent text-white font-semibold rounded-full hover:scale-105 transition-all shadow-lg"
      >
        Return to Home
      </Button>
    </motion.div>
  );
};
