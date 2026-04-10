//region imports
import { Music, Github, Twitter, Instagram, Mail } from "lucide-react";
//endregion

//region component
/**
 * Footer component with branding, navigation links, and social media icons
 * @returns {JSX.Element} Footer component
 */
export const Footer = () => {
  return (
    <footer className="glass border-t border-border mt-24">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-accent shadow-float">
                <Music className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-bold">MuseAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered music discovery that understands your mood and visual inspiration.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-muted-foreground hover:text-accent transition-smooth">
                  Features
                </a>
              </li>
              <li>
                <a href="/songs" className="text-sm text-muted-foreground hover:text-accent transition-smooth">
                  Browse Songs
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm text-muted-foreground hover:text-accent transition-smooth">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-smooth">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-smooth">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-smooth">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-smooth"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-smooth"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-smooth"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-smooth"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 MuseAI. All rights reserved. Designed with precision and care.
          </p>
        </div>
      </div>
    </footer>
  );
};
//endregion
