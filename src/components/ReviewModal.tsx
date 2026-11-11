import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Star, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReviewModal: React.FC = () => {
  const { reviewModalItem, setReviewModalItem, user, showToast } = useApp();

  const [rating, setRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!reviewModalItem) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Please enter your name', 'info');
      return;
    }
    if (!comment.trim()) {
      showToast('Please share your thoughts in the review comment', 'info');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuItemId: reviewModalItem.id,
          userId: user?.id || null,
          customerName: customerName.trim(),
          rating,
          foodRating,
          serviceRating,
          deliveryRating,
          comment: comment.trim(),
          isApproved: true,
        }),
      });

      if (res.ok) {
        showToast('Thank you! Your review has been submitted.');
        setReviewModalItem(null);
      } else {
        showToast('Failed to submit review', 'error');
      }
    } catch {
      showToast('Network error submitting review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-stone-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                Customer Feedback
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-100">
                Rate & Review
              </h3>
              <p className="text-xs text-stone-400 mt-0.5 font-medium">{reviewModalItem.name}</p>
            </div>
            <button
              onClick={() => setReviewModalItem(null)}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Overall Star Rating */}
            <div className="flex flex-col items-center justify-center py-2 bg-stone-950/60 rounded-2xl border border-stone-800">
              <span className="text-xs text-stone-400 mb-2">Overall Rating</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-stone-600 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400 scale-110'
                          : 'text-stone-700'
                      } transition-all`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Aspect Ratings */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-stone-950/40 p-2.5 rounded-xl border border-stone-800 text-center">
                <span className="text-stone-400 block mb-1">Taste</span>
                <select
                  value={foodRating}
                  onChange={(e) => setFoodRating(parseInt(e.target.value, 10))}
                  className="bg-stone-800 border border-stone-700 rounded-lg text-xs px-2 py-1 text-stone-200"
                >
                  <option value={5}>5 ★ Excellent</option>
                  <option value={4}>4 ★ Good</option>
                  <option value={3}>3 ★ Average</option>
                  <option value={2}>2 ★ Poor</option>
                  <option value={1}>1 ★ Bad</option>
                </select>
              </div>

              <div className="bg-stone-950/40 p-2.5 rounded-xl border border-stone-800 text-center">
                <span className="text-stone-400 block mb-1">Service</span>
                <select
                  value={serviceRating}
                  onChange={(e) => setServiceRating(parseInt(e.target.value, 10))}
                  className="bg-stone-800 border border-stone-700 rounded-lg text-xs px-2 py-1 text-stone-200"
                >
                  <option value={5}>5 ★ Fast</option>
                  <option value={4}>4 ★ Good</option>
                  <option value={3}>3 ★ Average</option>
                  <option value={2}>2 ★ Slow</option>
                  <option value={1}>1 ★ Poor</option>
                </select>
              </div>

              <div className="bg-stone-950/40 p-2.5 rounded-xl border border-stone-800 text-center">
                <span className="text-stone-400 block mb-1">Packaging</span>
                <select
                  value={deliveryRating}
                  onChange={(e) => setDeliveryRating(parseInt(e.target.value, 10))}
                  className="bg-stone-800 border border-stone-700 rounded-lg text-xs px-2 py-1 text-stone-200"
                >
                  <option value={5}>5 ★ Fresh/Hot</option>
                  <option value={4}>4 ★ Neat</option>
                  <option value={3}>3 ★ Okay</option>
                  <option value={2}>2 ★ Lukewarm</option>
                  <option value={1}>1 ★ Spilled</option>
                </select>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-[11px] text-stone-400">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Hammad Malik"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl text-xs sm:text-sm px-3 py-2 text-stone-100 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1">
              <label className="text-[11px] text-stone-400">Your Review</label>
              <textarea
                required
                rows={3}
                placeholder="How was the flavor, portion, and warmth of the food?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl text-xs sm:text-sm px-3 py-2 text-stone-100 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-review"
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-stone-950 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all text-sm"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
