import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-16 bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-16">Contact Us</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-purple-400 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">Visit Us</h3>
                  <p className="mt-2 text-gray-300">
                    123 Innovation Drive<br />
                    Tech Valley, Kerala<br />
                    India 682021
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-purple-400 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">Email Us</h3>
                  <p className="mt-2 text-gray-300">
                    support@dialecto.com<br />
                    business@dialecto.com
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-purple-400 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">Call Us</h3>
                  <p className="mt-2 text-gray-300">
                    +91 (123) 456-7890<br />
                    Mon-Fri from 9am to 6pm
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md bg-white/10 border border-purple-500/20 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md bg-white/10 border border-purple-500/20 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md bg-white/10 border border-purple-500/20 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}