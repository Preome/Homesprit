import React, { useState } from 'react';
import { Review, Service } from '../types';
import { Star, ShieldCheck, Plus, X } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
  services: Service[];
  onAddReview: (newReview: {
    serviceId: string;
    userName: string;
    userLocation: string;
    rating: number;
    comment: string;
  }) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  services,
  onAddReview,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('Pacific Heights');
  const [serviceId, setServiceId] = useState(services[0]?.id || 'srv-clean-01');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !userName) return;

    onAddReview({
      serviceId,
      userName,
      userLocation,
      rating,
      comment,
    });

    setComment('');
    setUserName('');
    setIsModalOpen(false);
  };

  return (
    <section className="py-16 lg:py-24 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
              Audited Feedback
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              Verified client testimonials
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600">
              Honest ratings from verified homeowners following comprehensive quality inspection.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Submit Client Evaluation
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-neutral-200 rounded-xl p-6 shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Rating & Verified Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>

                  {rev.verifiedBooking && (
                    <span className="text-[11px] font-medium text-neutral-600 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-neutral-900" />
                      Verified Visit
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-neutral-900 mb-2">
                  {rev.serviceName}
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author footer */}
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <div>
                  <div className="font-semibold text-neutral-900">{rev.userName}</div>
                  <div>{rev.userLocation}</div>
                </div>
                <div className="font-mono text-[11px] tabular-nums">{rev.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
            <div
              className="bg-white border border-neutral-200 rounded-xl shadow-xl w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200 mb-4">
                <h3 className="text-base font-bold text-neutral-950">
                  Submit Client Evaluation
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Neighborhood / City
                  </label>
                  <input
                    type="text"
                    required
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Service Evaluated
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className={`px-3 py-1.5 text-xs font-mono rounded border cursor-pointer ${
                          rating === num
                            ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        ★ {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Evaluation Comments
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the craftsmanship, punctuality, and attention to surface care..."
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                  >
                    Submit Review to Database
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
