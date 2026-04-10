import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Sparkles, Camera, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/api";
import { toast } from "react-toastify";

type GetRecommendationsProps = {
  onRecommend?: (payload: Record<string, unknown> | Record<string, unknown>[]) => void;
  onClose?: () => void;
  isModal?: boolean;
};

// Emoji helper functions
const getEmotionEmoji = (emotion: string): string => {
  const emo = emotion.toLowerCase();
  if (emo.includes('happy') || emo.includes('joy')) return '😊';
  if (emo.includes('sad') || emo.includes('sadness')) return '😢';
  if (emo.includes('angry') || emo.includes('anger')) return '😠';
  if (emo.includes('fear') || emo.includes('afraid')) return '😨';
  if (emo.includes('surprise') || emo.includes('surprised')) return '😲';
  if (emo.includes('disgust') || emo.includes('disgusted')) return '🤢';
  if (emo.includes('neutral') || emo.includes('calm')) return '😐';
  if (emo.includes('love') || emo.includes('loving')) return '😍';
  if (emo.includes('excited') || emo.includes('excitement')) return '🤩';
  if (emo.includes('confused') || emo.includes('confusion')) return '😕';
  if (emo.includes('anxious') || emo.includes('anxiety')) return '😰';
  if (emo.includes('confident') || emo.includes('confidence')) return '😎';
  return '😊';
};

const getContextEmoji = (context: string): string => {
  const ctx = context.toLowerCase();
  if (ctx.includes('indoor')) return '🏠';
  if (ctx.includes('outdoor')) return '🌳';
  if (ctx.includes('urban')) return '🏙️';
  if (ctx.includes('nature')) return '🌲';
  if (ctx.includes('beach')) return '🏖️';
  if (ctx.includes('mountain')) return '⛰️';
  if (ctx.includes('forest')) return '🌲';
  if (ctx.includes('city')) return '🏙️';
  if (ctx.includes('park')) return '🌳';
  if (ctx.includes('water')) return '💧';
  if (ctx.includes('sky')) return '☁️';
  if (ctx.includes('night')) return '🌙';
  if (ctx.includes('day')) return '☀️';
  return '🎬';
};

const getClimateEmoji = (climate: string): string => {
  const clim = climate.toLowerCase();
  if (clim.includes('sunny') || clim.includes('clear')) return '☀️';
  if (clim.includes('rainy') || clim.includes('rain')) return '🌧️';
  if (clim.includes('cloudy') || clim.includes('cloud')) return '☁️';
  if (clim.includes('snowy') || clim.includes('snow')) return '❄️';
  if (clim.includes('stormy') || clim.includes('storm')) return '⛈️';
  if (clim.includes('foggy') || clim.includes('fog')) return '🌫️';
  if (clim.includes('windy') || clim.includes('wind')) return '💨';
  if (clim.includes('normal')) return '🌤️';
  return '🌤️';
};

const getWeatherEmoji = (weather: string): string => {
  const w = weather.toLowerCase();
  if (w.includes('clear') || w.includes('sunny')) return '☀️';
  if (w.includes('rain')) return '🌧️';
  if (w.includes('cloud')) return '☁️';
  if (w.includes('snow')) return '❄️';
  if (w.includes('storm')) return '⛈️';
  if (w.includes('fog')) return '🌫️';
  if (w.includes('wind')) return '💨';
  return '🌤️';
};

export const GetRecommendations = ({ onRecommend, onClose, isModal = false }: GetRecommendationsProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      (async () => {
        try {
          setLoading(true);
          const payload = await uploadImage(file, 10);
          setLastPayload(payload as Record<string, any>);
          if (onRecommend) onRecommend(payload as Record<string, unknown>);
        } catch (err) {
          console.error('Upload recommend failed', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      (async () => {
        try {
          setLoading(true);
          const payload = await uploadImage(file, 10);
          setLastPayload(payload as Record<string, any>);
          if (onRecommend) onRecommend(payload as Record<string, unknown>);
        } catch (err) {
          console.error('Upload recommend failed', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  // Camera functions
  useEffect(() => {
    if (!isCameraOpen) return;

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Failed to access camera:", err);
        toast.error("Unable to access camera. Please check permissions.");
        setIsCameraOpen(false);
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOpen]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const context = canvasRef.current.getContext("2d");
      if (!context) return;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });

        const reader = new FileReader();
        reader.onload = (e) => {
          setCapturedImage(e.target?.result as string);
          setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(blob);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        setIsCameraOpen(false);

        try {
          setLoading(true);
          const payload = await uploadImage(file, 10);
          setLastPayload(payload as Record<string, any>);
          if (onRecommend) onRecommend(payload as Record<string, unknown>);
          toast.success("Image captured and analyzed!");
        } catch (err) {
          console.error("Upload recommend failed", err);
          toast.error("Failed to get recommendations");
        } finally {
          setLoading(false);
        }
      }, "image/jpeg", 0.95);
    } catch (err) {
      console.error("Capture failed:", err);
      toast.error("Failed to capture image");
    }
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
    setCapturedImage(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setLastPayload(null);
    if (onRecommend) onRecommend([]);
  };

  const content = (
    <div
      className={`glass rounded-3xl p-12 shadow-elegant transition-smooth ${
        isDragging ? "scale-105 glow-accent" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {!uploadedImage ? (
        <div className="text-center space-y-6">
          <div className="inline-flex p-6 rounded-2xl bg-gradient-accent shadow-float">
            <Upload className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-semibold mb-2 text-foreground">
              Drop Your Image Here
            </h3>
            <p className="text-muted-foreground mb-6">
              or click to browse from your device
            </p>
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <label htmlFor="file-upload">
                <Button
                  className="rounded-full px-8 py-6 shadow-float transition-smooth hover:shadow-elegant hover:scale-105 bg-gradient-premium text-white font-semibold cursor-pointer"
                  asChild
                >
                  <span>
                    <ImageIcon className="mr-2 w-5 h-5 text-white" />
                    Choose Image
                  </span>
                </Button>
              </label>
              <Button
                onClick={() => setIsCameraOpen(true)}
                className="rounded-full px-8 py-6 shadow-float transition-smooth hover:shadow-elegant hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Capture Live
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Supports JPG, PNG, WEBP up to 10MB
          </p>
        </div>
      ) : (
        <>
          {isModal ? (
            // Modal mode: Show success message and close
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="p-4 bg-accent/20 rounded-full"
              >
                <Sparkles className="w-12 h-12 text-accent" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">Image Captured Successfully!</h3>
                <p className="text-muted-foreground mb-6">Click Done to view recommendations on the Songs page</p>
              </div>
              <Button
                onClick={onClose}
                className="rounded-full px-8 py-3 bg-gradient-accent text-white font-semibold hover:scale-105 transition-all"
              >
                Done
              </Button>
            </div>
          ) : (
            // Non-modal mode: Show full analysis
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="relative rounded-2xl overflow-hidden shadow-float lg:col-span-2 h-96">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="text-center text-sm text-muted-foreground mt-2">Your Image</div>
              </div>
              <div className="glass rounded-2xl p-6 space-y-4 lg:col-span-1 h-96 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-accent animate-glow" />
                  <h3 className="text-xl font-semibold">Analysis Results</h3>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="p-3 bg-accent/20 rounded-full"
                    >
                      <Upload className="w-8 h-8 text-accent opacity-80" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-12 h-12 border-3 border-accent/30 border-t-accent rounded-full"
                    />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">Your recommendations are being prepared...</p>
                      <p className="text-xs text-muted-foreground mt-2">Analyzing emotion, context & climate</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>Detected Emotion:</span>
                      </div>
                      {lastPayload?.analysis?.confidence !== undefined ? (
                        <div className="w-full bg-[rgba(255,255,255,0.06)] rounded-full h-3 mt-2 overflow-hidden">
                          <div className="h-3 bg-blue-500" style={{ width: `${Math.round((lastPayload.analysis.confidence as number) * 100)}%` }} />
                        </div>
                      ) : (
                        <div className="w-full bg-[rgba(255,255,255,0.06)] rounded-full h-2 mt-2" />
                      )}
                      <div className="mt-2 text-sm text-muted-foreground">
                        {lastPayload?.analysis?.emotion 
                          ? `${getEmotionEmoji(String(lastPayload.analysis.emotion))} ${String(lastPayload.analysis.emotion).charAt(0).toUpperCase() + String(lastPayload.analysis.emotion).slice(1)}${lastPayload.analysis.confidence ? ` (${(lastPayload.analysis.confidence * 100).toFixed(1)}% confidence)` : ''}` 
                          : '❓ Unknown'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mt-3">
                      <div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>Scene Context:</span>
                        </div>
                        <div className="mt-2 bg-background rounded-md p-3 text-foreground">
                          {lastPayload?.analysis?.context ? `${getContextEmoji(String(lastPayload.analysis.context))} ${String(lastPayload.analysis.context).toUpperCase()}` : '❓ Unknown'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>Image Climate:</span>
                        </div>
                        <div className="mt-2 bg-background rounded-md p-3 text-foreground">
                          {lastPayload?.analysis?.climate ? `${getClimateEmoji(String(lastPayload.analysis.climate))} ${String(lastPayload.analysis.climate).toUpperCase()}` : '❓ Unknown'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>Location:</span>
                          </div>
                          <div className="mt-2 bg-background rounded-md p-3 text-foreground text-xs">
                            {lastPayload?.location ? `📌 ${lastPayload.location.city || ''}${lastPayload.location.region ? ', ' + lastPayload.location.region : ''}${lastPayload.location.country ? ', ' + lastPayload.location.country : ''}` : '❓ Unknown'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>Weather:</span>
                          </div>
                          <div className="mt-2 bg-background rounded-md p-3 text-foreground text-xs">
                            <div className="font-semibold">
                              {lastPayload?.weather?.climate ? `${getWeatherEmoji(String(lastPayload.weather.climate))} ${String(lastPayload.weather.climate).toUpperCase()}` : '❓ Unknown'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              🌡️ Temp: {lastPayload?.weather?.temp !== undefined && lastPayload.weather.temp !== null ? String(lastPayload.weather.temp) + '°C' : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full rounded-full glass transition-smooth hover:scale-105"
                        onClick={handleReset}
                      >
                        Get Recommendations Again
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div className="glass rounded-3xl p-8 shadow-elegant w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="mt-4">{content}</div>
        </div>

        {/* Camera Modal */}
        {isCameraOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="glass rounded-3xl p-8 shadow-elegant max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-white">Live Camera Capture</h2>
                <button
                  onClick={handleCameraClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {!capturedImage ? (
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden bg-black shadow-float">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-accent/30 rounded-2xl pointer-events-none" />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleCapture}
                      disabled={loading}
                      className="flex-1 rounded-full px-6 py-4 bg-gradient-accent text-white font-semibold hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5" />
                          Capture & Analyze
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCameraClose}
                      variant="outline"
                      className="flex-1 rounded-full px-6 py-4"
                    >
                      Cancel
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    Position yourself in good lighting for best results
                  </p>
                </div>
              ) : null}
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <section className="py-24 relative">
      <div className="w-[90%] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Turn Your{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Vision Into Sound
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload an image and let our AI discover the perfect musical companion for your visual moment
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-7xl mx-auto w-full"
        >
          {content}
        </motion.div>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="glass rounded-3xl p-8 shadow-elegant max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Live Camera Capture</h2>
              <button
                onClick={handleCameraClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {!capturedImage ? (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden bg-black shadow-float">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 border-4 border-accent/30 rounded-2xl pointer-events-none" />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleCapture}
                    disabled={loading}
                    className="flex-1 rounded-full px-6 py-4 bg-gradient-accent text-white font-semibold hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        Capture & Analyze
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCameraClose}
                    variant="outline"
                    className="flex-1 rounded-full px-6 py-4"
                  >
                    Cancel
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Position yourself in good lighting for best results
                </p>
              </div>
            ) : null}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      )}
    </section>
  );
};
