import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Acquiring a Property');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 5 Columns: Offices & Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                Contact Concierge
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
                Connect with our advisory team
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Whether you are seeking private off-market residences, listing an architectural landmark, or inquiring about property management, our senior brokers are at your service.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-neutral-200 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-neutral-900">San Francisco Flagship</div>
                  <div className="text-neutral-500">450 Pacific Avenue, Suite 400, San Francisco, CA 94133</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-neutral-900">Los Angeles Advisory</div>
                  <div className="text-neutral-500">9601 Wilshire Blvd, Beverly Hills, CA 90210</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-neutral-900 shrink-0" />
                <div className="text-neutral-900 font-mono">+1 (555) 890-4412</div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-900 shrink-0" />
                <div className="text-neutral-900 font-mono">concierge@homesprit.com</div>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: Direct Contact Form */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950">Message Received</h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Thank you, {name}. A senior managing partner will contact you shortly regarding your {interest.toLowerCase()} inquiry.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-neutral-500 underline hover:text-neutral-900 cursor-pointer pt-2 block mx-auto"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. eleanor@example.com"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Primary Area of Interest</label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                    >
                      <option value="Acquiring a Property">Acquiring an Architectural Property</option>
                      <option value="Listing a Luxury Residence">Listing a Luxury Residence</option>
                      <option value="Commercial Leasing">Commercial Leasing & Headquarter Spaces</option>
                      <option value="Property Management">Asset & Property Management</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Message / Requirements</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your desired location, timeline, and architectural preferences..."
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Direct Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
