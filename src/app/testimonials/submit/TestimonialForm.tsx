"use client";

import { useState } from "react";
import { Star, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { submitTestimonialAction } from "@/features/testimonials/actions";

export default function TestimonialForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Name is required");
    if (!email.trim()) return setError("Email is required");
    if (rating === 0) return setError("Please select a star rating");
    if (review.trim().length < 10) return setError("Testimonial must be at least 10 characters");
    if (review.length > 500) return setError("Testimonial must be 500 characters or less");
    if (!consent) return setError("You must agree to the consent statement");

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitTestimonialAction({
        name,
        email,
        rating,
        review,
        consent,
      });

      if (response?.error) {
        setError(response.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto bg-surface-container border border-primary/20 rounded-2xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>

        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider mb-4">
          Thank you!
        </h2>
        <p className="font-body-md text-secondary text-sm md:text-base leading-relaxed mb-8">
          Thank you for sharing your experience! Your testimonial has been submitted successfully and will appear on our website once approved by our team.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            prefetch={false}
            className="px-6 py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md font-bold hover:bg-primary active:scale-95 transition-all text-center"
          >
            Back to Home
          </Link>
          <button
            onClick={() => {
              setName("");
              setEmail("");
              setRating(0);
              setReview("");
              setConsent(false);
              setSuccess(false);
            }}
            className="px-6 py-3 rounded-xl border border-outline-variant hover:border-primary/50 text-white font-label-md font-bold active:scale-95 transition-all text-center"
          >
            Submit Another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-xl relative">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" prefetch={false} className="text-secondary hover:text-white transition-colors flex items-center gap-1 text-xs">
          <ArrowLeft className="w-4.5 h-4.5" /> Back to Home
        </Link>
      </div>

      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
          Share Your Journey
        </h2>
        <p className="font-body-md text-sm text-secondary mt-2">
          Tell others how The FitHub Gym helped you smash your fitness goals!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-md">
        {error && (
          <div className="bg-error/10 border border-error/20 text-error rounded-xl p-4 text-sm font-semibold">
            {error}
          </div>
        )}

        <div>
          <label className="input-label" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            className="input-field"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="input-label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="input-label">
            Your Rating
          </label>
          <div className="flex items-center gap-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= (hoveredRating || rating);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      active ? "fill-primary text-primary" : "text-[#2e2e2d] fill-none"
                    }`}
                  />
                </button>
              );
            })}
            {rating > 0 && (
              <span className="text-primary font-bold ml-2 text-sm uppercase font-display">
                {rating === 5 ? "Elite" : rating === 4 ? "Strong" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="input-label !mb-0" htmlFor="review">
              Testimonial / Review
            </label>
            <span
              className={`text-xs font-semibold ${
                review.length > 450 ? "text-error" : "text-on-surface-variant"
              }`}
            >
              {review.length} / 500
            </span>
          </div>
          <textarea
            id="review"
            rows={5}
            className="input-field min-h-[120px] py-3 leading-relaxed resize-none !h-auto scrollbar-themed"
            placeholder="Write your experience here (e.g. details about training quality, facility setup, or staff attitude)..."
            value={review}
            onChange={(e) => setReview(e.target.value.slice(0, 500))}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-start gap-3 py-2">
          <input
            id="consent"
            type="checkbox"
            className="w-5 h-5 rounded border-[#323232] bg-[#181818] text-primary focus:ring-primary focus:ring-offset-background cursor-pointer mt-1"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            disabled={isSubmitting}
          />
          <label htmlFor="consent" className="text-secondary text-xs leading-relaxed cursor-pointer select-none">
            I agree that The FitHub Gym may publish my testimonial on its website and promotional materials.
          </label>
        </div>

        <button
          type="submit"
          className={`w-full py-4 rounded-xl font-label-md font-extrabold flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer ${
            consent && !isSubmitting
              ? "bg-primary-container text-on-primary-container hover:bg-primary"
              : "bg-surface-container-highest text-on-surface-variant/40 border border-outline-variant/50 cursor-not-allowed"
          }`}
          disabled={!consent || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting Testimonial...
            </>
          ) : (
            "Submit Testimonial"
          )}
        </button>
      </form>
    </div>
  );
}
