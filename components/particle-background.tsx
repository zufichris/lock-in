"use client";

import React, { useRef, useEffect, useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Share2,
  Download,
  Twitter,
  Github,
  X,
  PlusCircle,
  Link as LinkIcon,
  Instagram,
  Sparkles,
  // ImageIcon removed as unused
  Target,
  CalendarClock,
  Mail,
  User,
  RefreshCcw,
} from "lucide-react";
import { calculateDaysLeft, getRandomQuote, shuffleImages } from "@/lib/quotes";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// --- Interfaces & Helper ---
export interface Goal {
  name: string;
  goal: string;
  timeframe: string;
  deadline: string;
}
export interface Quote { text: string; author: string; }
export interface GoalCardProps { goal: Goal; onReset: () => void; }



// --- Constants ---
// TODO: Replace with your actual deployed URL
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : "https://your-lockin-app.com";

// --- Image Gallery Component ---
const ImageGallery = memo(() => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4500, stopOnInteraction: false })]);

  const [images, setImages] = useState<string[]>([])

  const getImages = useCallback(async () => {
    const imgs = await shuffleImages()
    setImages(imgs)
  }, [])
  useEffect(() => {
    getImages()
  }, [getImages])
  return (
    <div className="relative w-full max-w-[450px] sm:max-w-sm mx-auto mt-2 mb-1" aria-label="Inspirational Gallery">
      <div className="overflow-hidden rounded-lg shadow-lg border border-gray-800/50" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            // Aspect ratio adjusted for better visibility
            <div className="relative flex-[0_0_100%] aspect-[16/10]" key={src}> {/* Use image src or a unique id if available for key */}
              <img
                src={src}
                alt={`Inspirational anime style image ${index + 1}`}
                className="block h-full w-full object-cover"
                loading="lazy" // Lazy loading is good
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
ImageGallery.displayName = 'ImageGallery';

// --- GoalCard Component ---
const GoalCard = memo(function GoalCard({ goal, onReset }: GoalCardProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingHtml2Canvas, setIsLoadingHtml2Canvas] = useState(false);
  const daysLeft = calculateDaysLeft(goal.deadline);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || isDownloading || isLoadingHtml2Canvas) return;

    const cardElement = cardRef.current;
    // Select elements to hide during download (buttons and share options)
    const elementsToHide = cardElement.querySelectorAll('.action-button-container, .share-options-container, .reset-button-container');

    try {
      setIsLoadingHtml2Canvas(true);
      setIsDownloading(true);
      const html2canvas = (await import("html2canvas")).default;
      setIsLoadingHtml2Canvas(false); // Loaded, now processing

      // Hide elements before taking screenshot
      elementsToHide.forEach(el => (el as HTMLElement).style.visibility = 'hidden');

      const canvas = await html2canvas(cardElement, {
        backgroundColor: "#000000", // Match background
        scale: 2.5, // Higher resolution
        logging: false,
        useCORS: true, // Important for external images if used within the card
        allowTaint: true, // May help with cross-origin images
        // Consider removing elements entirely if visibility hidden causes issues
        // ignoreElements: (element) => element.classList.contains('no-download')
      });

      // Restore visibility after screenshot
      elementsToHide.forEach(el => (el as HTMLElement).style.visibility = 'visible');

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      // Sanitize filename parts
      const safeName = goal.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const safeGoal = goal.goal.substring(0, 10).replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `lockin-goal-${safeName}-${safeGoal}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate download image. There might be an issue loading resources or browser restrictions.");
      // Ensure elements are visible even if error occurs
      elementsToHide.forEach(el => (el as HTMLElement).style.visibility = 'visible');
    } finally {
      setIsDownloading(false);
      setIsLoadingHtml2Canvas(false);
    }
  }, [goal.goal, goal.name, isDownloading, isLoadingHtml2Canvas]); // Dependencies are correct

  // Improved Share Handler
  const handleShare = useCallback(async (platform: string) => {
    let shareUrl = "";
    const goalText = goal.goal.length > 80 ? goal.goal.substring(0, 77) + "..." : goal.goal;
    const daysText = daysLeft !== null ? ` (${daysLeft} days left!)` : '';
    const deadlineDate = new Date(goal.deadline);
    // Adjust for timezone offset before formatting to ensure correct local date display
    deadlineDate.setMinutes(deadlineDate.getMinutes() + deadlineDate.getTimezoneOffset());
    const formattedDeadline = deadlineDate.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });

    // Construct the improved message
    const baseText = `${goal.name} is locked in! 🚀\n🎯 Goal: "${goalText}"\n⏳ Duration: ${goal.timeframe}\n🗓️ Deadline: ${formattedDeadline}${daysText}\n\nJoin the #LockIn challenge & focus on your goals: ${SITE_URL}`;
    const twitterText = `${goal.name} is locked in! 🚀\nGoal: "${goalText}" (${goal.timeframe}, by ${formattedDeadline}${daysText}).\n\nJoin the #LockIn challenge & focus up! 👇\n${SITE_URL}`;

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(baseText)}`;
        break;
      case "instagram":
        // Instagram still relies on copy-paste for web sharing captions
        navigator.clipboard.writeText(baseText + "\n\n#LockIn #GoalGetter #Focus")
          .then(() => alert("Caption copied! Paste it in your Instagram post/story."))
          .catch(() => alert("Could not copy text."));
        return; // Exit early for Instagram
      case "default":
        // Use Web Share API if available
        if (navigator.share) {
          try {
            await navigator.share({
              title: `${goal.name}'s Lock In Goal`,
              text: baseText,
              url: SITE_URL,
            });
          } catch (err: any) {
            // Silently ignore AbortError (user cancellation), log others
            if (err.name !== "AbortError") {
              console.error("Web Share API error:", err);
              // Attempt fallback share with text only if URL share failed
              try {
                await navigator.share({ text: baseText });
              } catch (fallbackErr: any) {
                if (fallbackErr.name !== 'AbortError') {
                  console.error("Web Share API fallback error:", fallbackErr);
                  alert("Sharing failed. You might need to copy the details manually.");
                }
              }
            }
          }
        } else {
          alert("Web Share API not supported on this browser/device. Try another option or copy the details manually.");
        }
        return; // Exit early for default share
      default:
        console.warn("Unknown share platform:", platform);
        alert("Unknown share platform selected.");
        return;
    }

    // Open share URL in new tab for Twitter/WhatsApp
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
    // Optionally close the share options after initiating share
    // setShowShareOptions(false);
  }, [goal, daysLeft]); // Dependencies are correct

  // Format date for display within the card
  const deadlineDateForDisplay = new Date(goal.deadline);
  // Adjust for timezone offset before formatting to ensure correct local date display
  deadlineDateForDisplay.setMinutes(deadlineDateForDisplay.getMinutes() + deadlineDateForDisplay.getTimezoneOffset());
  const formattedDate = deadlineDateForDisplay.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });


  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Card structure - contains content to be downloaded */}
      <Card ref={cardRef} className="bg-gradient-to-br from-black via-gray-900 to-black border border-gray-800 overflow-hidden shadow-[0_0_25px_rgba(0,220,255,0.25),_0_0_15px_rgba(255,153,0,0.2)] rounded-xl">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#00DCFF] via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#FF9900] via-transparent to-transparent"></div>
        </div>
        <CardContent className="p-6 md:p-8 relative z-10 text-white">
          <div className="flex flex-col space-y-5">
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-1.5">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#00DCFF]/50 to-[#00DCFF]"></div>
                <h3 className="text-xl md:text-2xl font-bold text-white mx-3 tracking-wider uppercase">Locked In</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#FF9900]/50 to-[#FF9900]"></div>
              </div>
              <div className="h-0.5 w-16 md:w-20 bg-gradient-to-r from-[#00DCFF] to-[#FF9900] mx-auto rounded-full"></div>
              {/* Display Name */}
              <p className="text-sm text-gray-400 mt-2 font-medium flex items-center justify-center gap-1.5">
                <User size={14} className="text-[#00DCFF]/80" /> {goal.name}
              </p>
            </div>

            {/* Goal Details */}
            <div className="space-y-4">
              <div className="bg-black/60 backdrop-blur-sm rounded-md p-3 border-l-4 border-[#00DCFF] shadow-inner shadow-black/30">
                <p className="text-[#99f0ff] text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center">
                  <Target className="w-3 h-3 mr-1.5" />Mission:
                </p>
                <p className="text-lg font-semibold break-words">{goal.goal}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-md p-3 border-l-4 border-[#FF9900] shadow-inner shadow-black/30">
                  <p className="text-[#ffcc99] text-[10px] font-semibold uppercase tracking-wider mb-1">Duration:</p>
                  <p className="font-medium break-words">{goal.timeframe}</p>
                </div>
                <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-md p-3 border-l-4 border-[#00DCFF] shadow-inner shadow-black/30">
                  <p className="text-[#99f0ff] text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Target Date:</span>
                    {daysLeft !== null && (
                      <span className="flex items-center text-xs font-normal text-gray-300 bg-white/5 px-1.5 py-0.5 rounded">
                        <CalendarClock className="w-3 h-3 mr-1 text-[#FF9900]" />
                        {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} Left
                      </span>
                    )}
                  </p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>
            </div>

            {/* Hashtag */}
            <div className="text-center pt-3">
              <div className="inline-block relative group">
                <span className="text-white font-bold text-base md:text-lg tracking-widest transition-colors duration-300 group-hover:text-[#00DCFF]">#LOCKIN</span>
                <div className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00DCFF] to-[#FF9900] transition-all duration-300 scale-x-100 group-hover:scale-x-110 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-400 mt-2 italic">Focus fuels results.</p>
            </div>
          </div>
        </CardContent>
      </Card> {/* End of Card content for download */}

      {/* Action Buttons (Outside Card for download) - Added container class */}
      <div className="action-button-container mt-5 flex justify-center items-center gap-3">
        <Button variant="outline" size="lg" className="flex-1 bg-black/60 backdrop-blur-sm border-[#00DCFF]/50 text-[#99f0ff] hover:bg-[#00363e] hover:text-white hover:border-[#00DCFF] transition-all duration-300 group hover:shadow-[0_0_10px_rgba(0,220,255,0.4)]" onClick={() => setShowShareOptions((prev) => !prev)} aria-expanded={showShareOptions}>
          <Share2 className={`mr-2 h-5 w-5 transition-transform duration-300 ${showShareOptions ? "rotate-12 scale-110" : "group-hover:rotate-[-5deg]"}`} />
          {showShareOptions ? "Sharing Options" : "Share Progress"}
        </Button>
        <Button variant="outline" size="lg" className="flex-1 bg-black/60 backdrop-blur-sm border-[#FF9900]/50 text-[#ffcc99] hover:bg-[#4d2e00] hover:text-white hover:border-[#FF9900] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_10px_rgba(255,153,0,0.4)]" onClick={handleDownload} disabled={isDownloading || isLoadingHtml2Canvas}>
          <Download className={`mr-2 h-5 w-5 transition-transform duration-300 ${isDownloading || isLoadingHtml2Canvas ? "animate-pulse" : "group-hover:scale-110"}`} />
          {isLoadingHtml2Canvas ? "Loading Img..." : isDownloading ? "Saving..." : "Save Card"}
        </Button>
      </div>

      {/* Share Options (Outside Card for download) - Added container class */}
      <div className="share-options-container">
        <AnimatePresence>
          {showShareOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 flex justify-center space-x-3 overflow-hidden"
            >
              {/* Twitter */}
              <Button variant="outline" size="icon" className="bg-black/60 backdrop-blur-sm border-[#00DCFF]/50 text-[#99f0ff] hover:bg-[#00363e] hover:text-white rounded-full h-11 w-11 transition-transform hover:scale-110" onClick={() => handleShare("twitter")} aria-label="Share on X/Twitter"><Twitter className="h-5 w-5" /></Button>
              {/* WhatsApp */}
              <Button variant="outline" size="icon" className="bg-black/60 backdrop-blur-sm border-green-500/50 text-green-400 hover:bg-green-950 hover:text-white rounded-full h-11 w-11 transition-transform hover:scale-110" onClick={() => handleShare("whatsapp")} aria-label="Share on WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </Button>
              {/* Instagram (Copy) */}
              <Button variant="outline" size="icon" className="bg-black/60 backdrop-blur-sm border-[#FF9900]/50 text-[#ffcc99] hover:bg-[#4d2e00] hover:text-white rounded-full h-11 w-11 transition-transform hover:scale-110" onClick={() => handleShare("instagram")} aria-label="Copy caption for Instagram"><Instagram className="h-5 w-5" /></Button>
              {/* Default Share (if supported) - Corrected check */}
              {typeof navigator !== "undefined" && navigator?.share?.name && (
                <Button variant="outline" size="icon" className="bg-black/60 backdrop-blur-sm border-gray-500/50 text-gray-400 hover:bg-gray-800 hover:text-white rounded-full h-11 w-11 transition-transform hover:scale-110" onClick={() => handleShare("default")} aria-label="More sharing options"><Share2 className="h-5 w-5" /></Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset Button (Outside Card for download) - Added container class */}
      {onReset && (
        <div className="reset-button-container mt-4 text-center">
          <Button
            variant="link"
            className="text-gray-400 hover:text-white text-xs transition-all duration-300 hover:tracking-wider"
            onClick={onReset}
          >
            Set New Mission
          </Button>
        </div>
      )}
    </motion.div>
  );
});
GoalCard.displayName = 'GoalCard';


// --- Main LockInComponent ---
export default function LockInComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: -Infinity, y: -Infinity });
  const isTouchingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false); // Used in particle effect logic
  const timeRef = useRef(0);
  const quoteIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // State
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [timeframeInput, setTimeframeInput] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);

  // --- Particle Effect useEffect ---
  useEffect(() => {
    // Guard against SSR execution
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context");
      return;
    }

    let localIsMobile = window.innerWidth < 768;
    setIsMobile(localIsMobile); // Set initial mobile state

    const updateCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const mobileCheck = window.innerWidth < 768;
      if (mobileCheck !== localIsMobile) {
        localIsMobile = mobileCheck;
        setIsMobile(mobileCheck); // Update state on resize
        // Debounce or throttle particle recreation if resize is frequent
        handleResize();
      }
    };

    let particles: Array<{
      x: number; y: number; baseX: number; baseY: number;
      size: number; color: string; scatteredColor: string;
      isSecondWord: boolean; speed: number; angle: number; amplitude: number;
    }> = [];
    let textImageData: ImageData | null = null;
    let textMetrics: { startX: number; startY: number; lockWidth: number; textSpacing: number; fontSize: number; } | null = null;

    function createTextImageData(): ImageData | null {
      if (!ctx || !canvas) return null;
      ctx.fillStyle = "white"; // Base color for sampling
      ctx.save();
      const fontSize = localIsMobile ? 60 : 110; // Responsive font size
      ctx.font = `bold ${fontSize}px 'Arial', sans-serif`; // Ensure font is loaded or use safe fallback
      const lockText = "LOCK";
      const inText = "IN";
      const lockMetrics = ctx.measureText(lockText);
      const inMetrics = ctx.measureText(inText);
      const textSpacing = localIsMobile ? 15 : 50; // Responsive spacing
      const totalWidth = lockMetrics.width + inMetrics.width + textSpacing;
      const startX = canvas.width / 2 - totalWidth / 2;
      // Vertically center the text more accurately (adjust baseline)
      const startY = canvas.height * 0.48 + fontSize / 3; // Fine-tune vertical position as needed

      ctx.fillText(lockText, startX, startY);
      ctx.fillText(inText, startX + lockMetrics.width + textSpacing, startY);
      ctx.restore();

      try {
        // Get image data covering the potential text area
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for drawing particles
        textMetrics = { startX, startY, lockWidth: lockMetrics.width, textSpacing, fontSize };
        return imageData;
      } catch (error) {
        console.error("Error getting ImageData (maybe canvas dimensions are 0?):", error);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return null;
      }

    }

    function isPixelInSecondWord(x: number): boolean {
      if (!textMetrics) return false;
      // Check if x is past the midpoint between LOCK and IN
      return x >= textMetrics.startX + textMetrics.lockWidth + textMetrics.textSpacing / 2;
    }

    function createParticle(): {
      x: number; y: number; baseX: number; baseY: number;
      size: number; color: string; scatteredColor: string;
      isSecondWord: boolean; speed: number; angle: number; amplitude: number;
    } | null {
      if (!canvas || !textImageData || !textMetrics) return null;
      const data = textImageData.data;
      const width = canvas.width;
      const height = canvas.height;
      // Try multiple times to find a valid pixel from the text
      for (let attempt = 0; attempt < 150; attempt++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const index = (y * width + x) * 4;
        // Check alpha channel value (data[index + 3])
        if (data[index + 3] > 128) { // If pixel is part of the drawn text
          const isSecond = isPixelInSecondWord(x);
          const particleSize = localIsMobile ? Math.random() * 1.5 + 1.0 : Math.random() * 1.5 + 0.5;
          const particleAmplitude = localIsMobile ? Math.random() * 6 + 2 : Math.random() * 10 + 3;
          return {
            x, // Start at the text position
            y,
            baseX: x, // Store original position
            baseY: y,
            size: particleSize,
            color: "white", // Base color when not interacting
            scatteredColor: isSecond ? "#FF9900" : "#00DCFF", // Color when interacting
            isSecondWord: isSecond,
            speed: Math.random() * 0.3 + 0.05, // Wave speed
            angle: Math.random() * Math.PI * 2, // Wave phase offset
            amplitude: particleAmplitude // Wave magnitude
          };
        }
      }
      return null; // No valid pixel found after attempts
    }

    function createInitialParticles() {
      if (!canvas) return;
      textImageData = createTextImageData();
      if (!textImageData) {
        console.error("Failed to create text image data for particles.");
        return; // Stop if image data couldn't be created
      }
      particles = [];
      // Adjust particle count based on screen size for performance
      const baseParticleCount = localIsMobile ? 7000 : 6500;
      const targetDensity = baseParticleCount / (1920 * 1080); // Density based on a reference resolution
      const currentArea = canvas.width * canvas.height;
      const particleCount = Math.max(900, Math.min(10000, Math.floor(targetDensity * currentArea))); // Min/Max caps

      let createdCount = 0;
      // Increase attempts relative to desired count
      for (let i = 0; i < particleCount * 10 && createdCount < particleCount; i++) {
        const particle = createParticle();
        if (particle) {
          particles.push(particle);
          createdCount++;
        }
      }
      if (createdCount < particleCount * 0.5 && particleCount > 0) {
        console.warn(`Particle creation efficiency low: ${createdCount}/${particleCount}. Text might be sparse.`);
      }
      // console.log(`Created ${createdCount} particles.`); // Debugging
    }

    let animationFrameId: number;
    function animate(timestamp: number) {
      if (!ctx || !canvas) return;
      timeRef.current = timestamp * 0.001; // Time in seconds
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const interactionRadius = localIsMobile ? 110 : 160;
      const maxDistance = interactionRadius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Wave motion based on base position
        const waveX = Math.sin(timeRef.current * p.speed + p.angle) * p.amplitude;
        const waveY = Math.cos(timeRef.current * p.speed + p.angle) * p.amplitude;
        const targetX = p.baseX + waveX;
        const targetY = p.baseY + waveY;

        // Interaction logic
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        let particleColor = p.color; // Default to white
        const isInteracting = distance < maxDistance && (isTouchingRef.current || mouseX > -Infinity); // Check touch or valid mouse pos

        if (isInteracting) {
          // Repulsion force calculation
          const force = (maxDistance - distance) / maxDistance; // Normalized force (stronger closer)
          const angle = Math.atan2(dy, dx); // Angle from mouse to particle
          const repulsionStrength = 65; // How strongly particles are pushed
          const moveX = Math.cos(angle) * force * repulsionStrength;
          const moveY = Math.sin(angle) * force * repulsionStrength;

          // Smoothly move away from mouse/touch
          p.x += ((p.x - moveX) - p.x) * 0.18; // Lerp towards repulsed position
          p.y += ((p.y - moveY) - p.y) * 0.18;

          particleColor = p.scatteredColor; // Change color on interaction
        } else {
          // Return to base position with wave motion
          p.x += (targetX - p.x) * 0.07; // Lerp back to target (waving) position
          p.y += (targetY - p.y) * 0.07;
        }

        // Draw particle
        ctx.fillStyle = particleColor;
        // Use fillRect for simplicity, could use arc for circles
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    // Debounced or throttled resize handler recommended for frequent resize events
    const handleResize = () => {
      if (canvas && ctx) {
        updateCanvasSize(); // Update canvas dims and mobile state
        cancelAnimationFrame(animationFrameId); // Stop previous animation loop
        createInitialParticles(); // Recreate particles based on new size/layout
        if (particles.length > 0) {
          animationFrameId = requestAnimationFrame(animate); // Start new animation loop
        }
      }
    };

    // Event Handlers
    const handleMove = (x: number, y: number) => { mousePositionRef.current = { x, y }; };
    const handleMouseMove = (e: MouseEvent) => { handleMove(e.clientX, e.clientY); };
    const handleTouchStart = (e: TouchEvent) => {
      // Allow touches to pass through if they start on interactive UI elements
      let passThrough = false;
      if (e.touches.length > 0 && contentRef.current) {
        const touch = e.touches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
        // Check if the touched element is inside the main content container
        if (targetElement && contentRef.current.contains(targetElement)) {
          passThrough = true;
        }
      }

      if (!passThrough && e.touches.length > 0) {
        isTouchingRef.current = true; // Signal active touch interaction for particles
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
        // Optionally prevent default scroll/zoom behavior ONLY if touch is on canvas background
        // e.preventDefault(); // Be careful with this, might block intended interactions
      } else {
        // If touch starts on UI or no touches, don't activate particle interaction via touch flag
        isTouchingRef.current = false;
        // Still update mouse position for potential hover effects if needed
        if (e.touches.length > 0) {
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isTouchingRef.current && e.touches.length > 0) { // Only move particles if touch started on background
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
        // Optionally prevent default scroll/zoom
        // e.preventDefault();
      } else if (e.touches.length > 0) {
        // Update position even if not actively interacting, for potential future interaction
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => {
      isTouchingRef.current = false; // Deactivate touch interaction
      // Reset mouse position to prevent lingering interaction effect
      mousePositionRef.current = { x: -Infinity, y: -Infinity };
    };

    // Initial setup
    updateCanvasSize(); // Set initial size
    createInitialParticles();
    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      console.error("Initialization failed: No particles created.");
    }

    // Add event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    // Use passive: false ONLY if you need preventDefault() for touchstart/touchmove on the canvas itself
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd); // Handle cancelled touches

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      cancelAnimationFrame(animationFrameId); // Stop animation loop on unmount
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Quote Fetching and Auto-Refresh ---
  const handleGetRandomQuote = useCallback(async () => {
    setIsFetchingQuote(true);
    try {
      setCurrentQuote(await getRandomQuote());
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      setCurrentQuote({ text: "Focus on your goal, the journey awaits.", author: "LockIn" }); // Fallback quote
    } finally {
      // Short delay for smoother visual transition of loading state
      setTimeout(() => setIsFetchingQuote(false), 300);
    }
  }, []); // No dependencies needed as getRandomQuote is static

  useEffect(() => {
    // Initial quote fetch on component mount
    handleGetRandomQuote();

    // Set up interval timer only when NO goal is currently set
    if (!currentGoal) {
      quoteIntervalRef.current = setInterval(handleGetRandomQuote, 20000); // Refresh every 20 seconds
    }

    // Cleanup function: clear interval when component unmounts or when a goal is set
    return () => {
      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current);
        quoteIntervalRef.current = null;
      }
    };
  }, [handleGetRandomQuote, currentGoal]); // Effect re-runs when currentGoal changes

  // --- Form & Modal Handlers ---
  const handleGoalSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    // Trim inputs and validate
    const trimmedName = nameInput.trim();
    const trimmedGoal = goalInput.trim();
    const trimmedTimeframe = timeframeInput.trim();

    if (!trimmedName || !trimmedGoal || !trimmedTimeframe || !deadlineInput) {
      setFormError("Please fill out all fields accurately.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight
    // Parse deadline date input
    const deadlineDate = new Date(deadlineInput);
    // Adjust for timezone offset to compare date part correctly against local 'today'
    deadlineDate.setMinutes(deadlineDate.getMinutes() + deadlineDate.getTimezoneOffset());
    deadlineDate.setHours(0, 0, 0, 0); // Normalize deadline to midnight

    if (isNaN(deadlineDate.getTime()) || deadlineDate < today) {
      setFormError("Deadline must be today or in the future.");
      return;
    }

    // Create the goal object
    const newGoal: Goal = {
      name: trimmedName,
      goal: trimmedGoal,
      timeframe: trimmedTimeframe,
      deadline: deadlineInput, // Store the original YYYY-MM-DD string
    };

    setCurrentGoal(newGoal); // Set the goal, triggers view change
    setIsModalOpen(false); // Close modal

    // Clear form fields
    setNameInput("");
    setGoalInput("");
    setTimeframeInput("");
    setDeadlineInput("");

    // Clear the quote refresh timer (handled by the useEffect dependency on currentGoal)
  };

  const handleOpenModal = () => {
    setFormError(null); // Clear previous errors
    setIsModalOpen(true);
  };

  const handleResetGoal = () => {
    setCurrentGoal(null); // Reset goal state, triggers view change
    // The quote timer will restart automatically via the useEffect dependency on currentGoal
  };

  const getTodayDateString = () => {
    const today = new Date();
    // Format to YYYY-MM-DD required by date input's min attribute
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubscriptionSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubscriptionError(null);
    const trimmedEmail = emailInput.trim();
    // Basic email format validation
    if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setSubscriptionError("Please enter a valid email address.");
      return;
    }
    // Placeholder for actual subscription logic
    console.log("Subscribed with email:", trimmedEmail);
    alert("Thanks for subscribing! We'll keep you motivated. (Placeholder)");
    setEmailInput(""); // Clear input
    setIsSubscriptionModalOpen(false); // Close modal
  };


  return (
    // Main container: Full viewport height, overflow hidden, flex column layout
    <div className="relative w-full h-dvh flex flex-col items-center bg-black overflow-hidden">
      {/* Canvas for background particle animation */}
      <canvas ref={canvasRef} className="w-full h-full z-0 absolute -top-20 left-0 pointer-events-none" aria-hidden="true" />

      {/* Content container: layered above canvas, manages layout */}
      <div
        ref={contentRef}
        // Flex column, space between top/middle/bottom, center items, padding
        className="relative z-10 flex flex-col items-center justify-between w-full h-full p-4 pb-2 text-center"
      >
        {/* AnimatePresence handles smooth transition between initial view and goal view */}
        <AnimatePresence mode="wait">
          {currentGoal ? (
            // --- GOAL VIEW ---
            <motion.div
              key="goalViewWrapper"
              className="flex items-center justify-center w-full h-full" // Center GoalCard
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GoalCard goal={currentGoal} onReset={handleResetGoal} />
            </motion.div>
          ) : (
            // --- INITIAL VIEW ---
            <motion.div
              key="initialViewWrapper"
              className="flex flex-col items-center justify-between h-full w-full max-w-xl" // Max width, full height for spacing
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* === Top Section (Quote) === */}
              <div className="w-full mt-1 flex-shrink-0"> {/* Prevent shrinking */}
                {/* Quote Display Area */}
                {currentQuote && (
                  <div className="relative w-full p-0.5 rounded-lg bg-gradient-to-br from-[#00DCFF]/30 via-transparent to-[#FF9900]/30 shadow-[0_0_15px_rgba(0,220,255,0.1),_0_0_10px_rgba(255,153,0,0.08)] border border-gray-800/60">
                    <div className="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-[5px]"> {/* Slightly reduced padding */}
                      {/* Animate quote text changes */}
                      <AnimatePresence mode="wait">
                        <motion.blockquote key={currentQuote.text} className="text-sm md:text-base italic text-gray-100 leading-snug min-h-[3em] flex items-center justify-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                          "{currentQuote.text}"
                        </motion.blockquote>
                      </AnimatePresence>
                      <motion.p className="text-xs md:text-sm text-gray-500 mt-1.5 text-right mr-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>
                        - {currentQuote.author}
                      </motion.p>
                      {/* Button to manually refresh quote */}
                      <div className="text-center mt-1">
                        <Button variant="link" size="sm" className="text-gray-400 hover:text-[#00DCFF] text-xs h-6 px-1 transition-all duration-200 hover:brightness-110 disabled:opacity-50" onClick={handleGetRandomQuote} disabled={isFetchingQuote} aria-label="Get another quote">
                          {isFetchingQuote ? (
                            <RefreshCcw className="w-3 h-3 mr-1 inline animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3 mr-1 inline opacity-80" />
                          )}
                          Another Spark
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* === Middle Section (Spacer) === */}
              {/* This flexible div pushes the top and bottom sections apart, making space for the canvas animation */}
              <div className="flex-grow"></div>

              {/* === Bottom Section === */}
              <div className="flex flex-col items-center w-full mb-0 flex-shrink-0"> {/* Prevent shrinking */}
                {/* Image Gallery */}
                <ImageGallery />

                {/* Engaging Tagline */}
                <p className="text-sm text-gray-400 px-4 mt-2 mb-3"> {/* Adjusted margins */}
                  Transform <span className="text-[#FF9900] font-medium">intent</span> into <span className="text-[#00DCFF] font-medium">achievement</span>.
                </p>

                {/* Create Goal Button */}
                <Button
                  size="lg"
                  className="group relative px-10 py-3 bg-gradient-to-r from-[#00DCFF] via-[#00aaff] to-[#FF9900] text-black font-bold rounded-full shadow-[0_0_18px_rgba(0,220,255,0.5),_0_0_12px_rgba(255,153,0,0.4)] transition-all duration-300 ease-out hover:shadow-[0_0_30px_rgba(0,220,255,0.7),_0_0_18px_rgba(255,153,0,0.6)] hover:scale-[1.03] active:scale-100 overflow-hidden"
                  onClick={handleOpenModal} // Opens the goal setting modal
                >
                  {/* Shiny hover effect */}
                  <span className="absolute top-0 left-[-100%] h-full w-[50px] bg-white/20 transform -skew-x-12 transition-all duration-700 group-hover:left-[150%] opacity-50 group-hover:opacity-100"></span>
                  <PlusCircle className="mr-2 h-5 w-5 inline-block group-hover:animate-pulse" />
                  Lock In Your Goal
                </Button>

                {/* Footer Links */}
                <footer className="w-full flex items-center justify-center space-x-3 md:space-x-4 px-4 pt-4 pb-1">
                  <a href="https://x.com/zufichris_" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#00DCFF] transition-all duration-200 flex items-center space-x-1 text-xs font-mono hover:scale-105" aria-label="Chris Zufelt on X/Twitter"><Twitter className="h-4 w-4" /><span className="hidden sm:inline">@zufichris_</span></a>
                  <span className="text-gray-600">|</span>
                  <a href="https://github.com/zufichris" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#FF9900] transition-all duration-200 flex items-center space-x-1 text-xs font-mono hover:scale-105" aria-label="Chris Zufelt on GitHub"><Github className="h-4 w-4" /><span className="hidden sm:inline">@zufichris</span></a>
                  <span className="text-gray-600">|</span>
                  <button onClick={() => setIsSubscriptionModalOpen(true)} className="text-gray-500 hover:text-[#00DCFF] transition-all duration-200 flex items-center space-x-1 text-xs font-mono hover:scale-105" aria-label="Subscribe to updates"><LinkIcon className="h-4 w-4" /><span className="hidden sm:inline">Stay Updated</span></button>
                </footer>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Modals --- */}
      {/* Goal Setting Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gradient-to-br from-black via-gray-950 to-black border border-gray-700 text-white max-w-md w-[90%] rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#00DCFF] to-[#FF9900] flex items-center justify-center gap-2">
              <Target className="w-6 h-6 opacity-80" /> Define Your Mission
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400 pt-1 px-4">
              Clarity is power. Specify your name, goal, duration, and deadline.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGoalSubmit} className="grid gap-4 py-4 px-2">
            {/* Name Input */}
            <div className="grid gap-2">
              <Label htmlFor="goal-name" className="text-gray-300">👤 Your Name / Alias:</Label>
              <Input id="goal-name" placeholder="e.g., Alex R., CodeNinja" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="bg-black/50 border-gray-600 focus:border-[#00DCFF] focus:ring-[#00DCFF] focus:ring-1 text-white" required aria-required="true" maxLength={50} />
            </div>
            {/* Goal Description Input */}
            <div className="grid gap-2">
              <Label htmlFor="goal-desc" className="text-gray-300">🎯 Your Specific Goal:</Label>
              <Textarea id="goal-desc" placeholder="e.g., Master React hooks, Run 10km..." value={goalInput} onChange={(e) => setGoalInput(e.target.value)} className="bg-black/50 border-gray-600 focus:border-[#00DCFF] focus:ring-[#00DCFF] focus:ring-1 text-white resize-none" rows={3} required aria-required="true" maxLength={200} />
            </div>
            {/* Timeframe Input */}
            <div className="grid gap-2">
              <Label htmlFor="goal-timeframe" className="text-gray-300">⏱️ Commitment Duration:</Label>
              <Input id="goal-timeframe" placeholder="e.g., 30 Days, This Quarter" value={timeframeInput} onChange={(e) => setTimeframeInput(e.target.value)} className="bg-black/50 border-gray-600 focus:border-[#FF9900] focus:ring-[#FF9900] focus:ring-1 text-white" required aria-required="true" maxLength={50} />
            </div>
            {/* Deadline Input */}
            <div className="grid gap-2">
              <Label htmlFor="goal-deadline" className="text-gray-300">📅 Target Date:</Label>
              <Input id="goal-deadline" type="date" value={deadlineInput} onChange={(e) => setDeadlineInput(e.target.value)} className="bg-black/50 border-gray-600 focus:border-[#00DCFF] focus:ring-[#00DCFF] focus:ring-1 text-white appearance-none [&::-webkit-calendar-picker-indicator]:filter-invert" min={getTodayDateString()} required aria-required="true" />
            </div>
            {/* Form Error Display */}
            {formError && (<p className="text-sm text-red-500 text-center">{formError}</p>)}
            {/* Modal Footer Buttons */}
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-2">
              <DialogClose asChild><Button type="button" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Cancel</Button></DialogClose>
              <Button type="submit" className="bg-gradient-to-r from-[#00DCFF] to-[#FF9900] text-black font-bold hover:opacity-90 transition-opacity hover:scale-[1.02] active:scale-100">Lock It In</Button>
            </DialogFooter>
          </form>
          {/* Close Button (Top Right) */}
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4 text-gray-400 hover:text-white" /><span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Subscription Modal */}
      <Dialog open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
        <DialogContent className="bg-gradient-to-br from-black via-gray-950 to-black border border-gray-700 text-white max-w-md w-[90%] rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#00DCFF] to-[#FF9900] flex items-center justify-center gap-2"><Mail className="w-6 h-6 opacity-80" /> Join the Focus Zone</DialogTitle>
            <DialogDescription className="text-center text-gray-400 pt-1 px-4">Get motivational boosts, focus strategies, and exclusive updates straight to your inbox. Zero spam.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubscriptionSubmit} className="grid gap-4 py-4 px-2">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-300">✉️ Your Best Email:</Label>
              <Input id="email" type="email" placeholder="you@domain.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="bg-black/50 border-gray-600 focus:border-[#00DCFF] focus:ring-[#00DCFF] focus:ring-1 text-white" required aria-required="true" aria-label="Email Address for Subscription" />
            </div>
            {subscriptionError && (<p className="text-sm text-red-500 text-center">{subscriptionError}</p>)}
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-2">
              <DialogClose asChild><Button type="button" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Cancel</Button></DialogClose>
              <Button type="submit" className="bg-gradient-to-r from-[#00DCFF] to-[#FF9900] text-black font-bold hover:opacity-90 transition-opacity hover:scale-[1.02] active:scale-100">Subscribe Now</Button>
            </DialogFooter>
          </form>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"><X className="h-4 w-4 text-gray-400 hover:text-white" /><span className="sr-only">Close</span></DialogClose>
        </DialogContent>
      </Dialog>

    </div>
  );
}