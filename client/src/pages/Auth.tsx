import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Music } from "lucide-react";
import LiquidEther from "@/components/animations/LiquidEther";
import ClickSpark from "@/components/animations/ClickSpark";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

// ─── Strong Validators ──────────────────────────────────────────────────────
const validateEmail = (v: string) => {
  if (!v.trim()) return "Email is required";
  // Strict regex for RFC 5322 compliance roughly
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(v)) return "Please enter a valid business or personal email";
  return "";
};

const validatePassword = (v: string, isLogin: boolean) => {
  if (!v) return "Password is required";
  if (isLogin) {
    if (v.length < 1) return "Password is required";
    return "";
  }
  
  // Strong validation for Sign Up
  if (v.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter";
  if (!/[a-z]/.test(v)) return "Include at least one lowercase letter";
  if (!/[0-9]/.test(v)) return "Include at least one number";
  if (!/[!@#$%^&*]/.test(v)) return "Include at least one special character (!@#$%^&*)";
  
  return "";
};

const validateName = (v: string, isLogin: boolean) => {
  if (isLogin) return "";
  if (!v.trim()) return "Full name is required for registration";
  if (v.trim().length < 2) return "Name is too short";
  return "";
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", name: "" });
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  // #region onBlur event handlers
  const handleEmailBlur = () =>
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));

  const handlePasswordBlur = () =>
    setErrors((prev) => ({ ...prev, password: validatePassword(password, isLogin) }));

  const handleNameBlur = () =>
    setErrors((prev) => ({ ...prev, name: validateName(name, isLogin) }));
  // #endregion

  // #region Submission Logic
  const performStrongValidation = () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password, isLogin);
    const nameErr = validateName(name, isLogin);

    setErrors({
      email: emailErr,
      password: passwordErr,
      name: nameErr
    });

    return !emailErr && !passwordErr && !nameErr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check before hitting API
    if (!performStrongValidation()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const authData = await auth.signIn(email.trim(), password);
        dispatch(setUser(authData.user));
        toast.success("Welcome back! Logged in successfully.");
        navigate("/");
      } else {
        await auth.signUp(email.trim(), password, name.trim());
        toast.success("Security verification required. Please check your inbox.");
        navigate("/verify-email", { state: { email: email.trim() } });
      }
    } catch (err: any) {
      toast.error(err.message || "Credential verification failed");
    } finally {
      setLoading(false);
    }
  };
  // #endregion

  const switchMode = () => {
    setIsLogin((v) => !v);
    setErrors({ email: "", password: "", name: "" });
  };

  return (
    <ClickSpark sparkColor="#FF9FFC" sparkSize={12} sparkRadius={20} sparkCount={8} duration={500}>
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="fixed inset-0 -z-10 bg-background">
          <LiquidEther colors={["#1a1a1a", "#0f0f0f", "#262626"]} mouseForce={15} cursorSize={80} autoDemo autoSpeed={0.3} autoIntensity={1.5} />
        </div>

        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            {/* Brand Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Music className="w-10 h-10 text-accent" />
                <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Muzly.AI
                </h1>
              </div>
              <p className="text-muted-foreground font-medium">
                {isLogin ? "Unlock your personal soundtrack" : "Join the future of intelligent music"}
              </p>
            </div>

            {/* Main Auth Form */}
            <div className="glass rounded-[2rem] p-10 shadow-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-20 h-20 text-accent" />
              </div>

              <h2 className="text-3xl font-display font-bold mb-8 text-white">
                {isLogin ? "Sign In" : "Sign Up"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* ── Name Field (Signup Only) ── */}
                {!isLogin && (
                  <div className="space-y-2 group">
                    <Label htmlFor="name" className="text-xs uppercase tracking-widest text-white/50 pl-1">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(er => ({ ...er, name: "" }));
                      }}
                      onBlur={handleNameBlur}
                      className={`h-12 bg-white/5 border-white/10 rounded-xl focus:border-accent/50 transition-all ${errors.name ? "border-red-500/50 ring-1 ring-red-500/20" : ""}`}
                    />
                    {errors.name && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 font-medium pl-1">
                        {errors.name}
                      </motion.p>
                    )}
                  </div>
                )}

                {/* ── Email Field ── */}
                <div className="space-y-2 group">
                  <Label htmlFor="email" className="text-xs uppercase tracking-widest text-white/50 pl-1">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(er => ({ ...er, email: "" }));
                    }}
                    onBlur={handleEmailBlur}
                    className={`h-12 bg-white/5 border-white/10 rounded-xl focus:border-accent/50 transition-all ${errors.email ? "border-red-500/50 ring-1 ring-red-500/20" : ""}`}
                  />
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 font-medium pl-1">
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* ── Password Field ── */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-center px-1">
                    <Label htmlFor="password" className="text-xs uppercase tracking-widest text-white/50">Password</Label>
                    {isLogin && <button type="button" className="text-[10px] uppercase tracking-tighter text-accent/80 hover:text-accent font-bold">Forgot?</button>}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(er => ({ ...er, password: "" }));
                    }}
                    onBlur={handlePasswordBlur}
                    className={`h-12 bg-white/5 border-white/10 rounded-xl focus:border-accent/50 transition-all ${errors.password ? "border-red-500/50 ring-1 ring-red-500/20" : ""}`}
                  />
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 font-medium pl-1">
                      {errors.password}
                    </motion.p>
                  )}
                  {!isLogin && !errors.password && (
                    <p className="text-[10px] text-white/30 uppercase tracking-widest pl-1">8+ chars, upper, lower, num, symbol</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-[0_8px_30px_rgb(255,159,252,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    isLogin ? "Secure Login" : "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <button
                  onClick={switchMode}
                  type="button"
                  className="text-sm text-muted-foreground hover:text-white transition-all group"
                >
                  {isLogin ? (
                    <>New to the platform? <span className="text-accent font-bold group-hover:underline decoration-accent/30 underline-offset-4 decoration-2">Sign Up</span></>
                  ) : (
                    <>Already a member? <span className="text-accent font-bold group-hover:underline decoration-accent/30 underline-offset-4 decoration-2">Sign In</span></>
                  )}
                </button>
              </div>
            </div>

            <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/20 mt-8">
              Encrypted Endpoint &bull; SOC2 Compliant &bull; 256-bit AES
            </p>
          </motion.div>
        </div>
      </div>
    </ClickSpark>
  );
}
