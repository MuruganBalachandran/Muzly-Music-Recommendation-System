//region imports
import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/lib/auth";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LiquidEther from "@/components/animations/LiquidEther";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
//endregion

//region validators
/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {string} Error message or empty string
 */
const validateEmailStrong = (email: string) => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
};

/**
 * Validate OTP format
 * @param {string[]} otp - OTP array to validate
 * @returns {string} Error message or empty string
 */
const validateOtpStrong = (otp: string[]) => {
  const full = otp.join("");
  if (full.length === 0) return "Authentication code is required";
  if (full.length < 6) return "Please enter the complete 6-digit code";
  if (!/^\d+$/.test(full)) return "Code must contain only digits";
  return "";
};
//endregion

//region component
/**
 * Email verification page component
 * @returns {JSX.Element} VerifyEmail component
 */
export default function VerifyEmail() {
  //region hooks
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  //endregion

  //region state

  // Email passed from Auth page via navigate state
  const [email, setEmail] = useState<string>((location.state as any)?.email ?? "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errors, setErrors] = useState({ email: "", otp: "" });
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  //endregion

  //region handlers
  /**
   * Handle OTP input change
   * @param {number} idx - Input index
   * @param {string} value - Input value
   */
  const handleOtpChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[idx] = value.slice(-1);
    setOtp(next);
    
    // Clear error on interact
    if (errors.otp) setErrors(prev => ({ ...prev, otp: "" }));
    
    // Auto-focus next input
    if (value && idx < 5) inputs.current[idx + 1]?.focus();
  };

  /**
   * Handle OTP input keydown event
   * @param {number} idx - Input index
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  /**
   * Handle OTP paste event
   * @param {React.ClipboardEvent} e - Clipboard event
   */
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    if (errors.otp) setErrors(prev => ({ ...prev, otp: "" }));
  };
  //endregion

  //region blur handlers
  /**
   * Handle email input blur event
   */
  const handleEmailBlur = () => 
    setErrors(prev => ({ ...prev, email: validateEmailStrong(email) }));

  /**
   * Handle OTP input blur event
   */
  const handleOtpBlur = () => {
    // Only show error if they've typed something or if it's explicitly incomplete
    const full = otp.join("");
    if (full.length > 0 && full.length < 6) {
      setErrors(prev => ({ ...prev, otp: "Code must be 6 digits" }));
    }
  };
  //endregion

  //region submit handlers
  /**
   * Handle form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailErr = validateEmailStrong(email);
    const otpErr = validateOtpStrong(otp);
    
    setErrors({ email: emailErr, otp: otpErr });
    
    if (emailErr || otpErr) {
      toast.error("Please provide a valid email and 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const authData = await auth.verifyEmail(email.trim(), otp.join(""));
      dispatch(setUser(authData.user));
      toast.success("Identity verified! Welcome to Muzly AI.");
      navigate("/", { replace: true });
    } catch (err: any) {
      const msg = err.message || "Invalid verification code";
      toast.error(msg);
      setErrors(prev => ({ ...prev, otp: msg }));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle resend OTP request
   */
  const handleResend = async () => {
    const emailErr = validateEmailStrong(email);
    if (emailErr) {
      setErrors(prev => ({ ...prev, email: emailErr }));
      return;
    }

    setResending(true);
    try {
      await auth.resendOtp(email.trim());
      toast.success("A fresh security code has been dispatched to your email.");
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err.message || "Dispatch failed. Try again in a few moments.");
    } finally {
      setResending(false);
    }
  };
  //endregion

  //region render
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="fixed inset-0 -z-10 bg-background">
        <LiquidEther colors={["#1c1c1c", "#0a0a0a", "#2a2a2a"]} autoDemo autoIntensity={1.2} />
      </div>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="glass rounded-[2rem] p-10 shadow-elegant border border-white/5">
            {/* Branding & Status */}
            <div className="text-center mb-10">
              <div className="inline-flex p-5 rounded-2xl bg-accent/10 border border-accent/20 mb-6 motion-safe:animate-pulse">
                <ShieldCheck className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-3">Security Verification</h1>
              <p className="text-sm text-muted-foreground max-w-[80%] mx-auto">
                We've sent a unique 6-digit code to protect your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Email Control */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-white/40 pl-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Target Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(er => ({ ...er, email: "" })); }}
                  onBlur={handleEmailBlur}
                  placeholder="name@domain.com"
                  className={`h-12 bg-white/5 border-white/10 rounded-xl transition-all focus:border-accent/50 ${errors.email ? "border-red-500/50" : ""}`}
                />
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 pl-1 font-medium">
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* OTP Input Grid */}
              <div className="space-y-4">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 pl-1">verification code</Label>
                <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { inputs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onBlur={handleOtpBlur}
                      className={`w-12 h-16 text-center text-2xl font-bold rounded-xl border bg-white/5 outline-none transition-all
                        focus:border-accent focus:ring-1 focus:ring-accent/30
                        ${errors.otp ? "border-red-500/50" : "border-white/10"}`}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-center text-red-400 font-medium">
                    {errors.otp}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-accent/20"
              >
                {loading ? (
                   <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Bypassing Encryption...
                  </div>
                ) : "Verify Identity"}
              </Button>
            </form>

            {/* Resend Actions */}
            <div className="mt-10 text-center border-t border-white/5 pt-8">
              <p className="text-sm text-muted-foreground">
                Wait, I didn't get the code.{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-accent font-bold hover:text-accent/80 transition-smooth disabled:opacity-50"
                >
                  {resending ? "Re-dispatching..." : "Resend Now"}
                </button>
              </p>
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="mt-6 text-xs text-white/30 hover:text-white transition-all block mx-auto uppercase tracking-tighter"
              >
                &lsaquo; Return to Login
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
  //endregion
}
//endregion
