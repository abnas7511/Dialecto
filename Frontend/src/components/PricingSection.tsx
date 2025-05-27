import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Basic",
    price: "$50",
    period: "/month",
    features: [
      "50 video translations",
      "720p quality",
      "Basic support",
      "2 rural dialects"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    features: [
      "150 video translations",
      "1080p quality",
      "Priority support",
      "5 rural dialects",
      "Custom voice options"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    features: [
      "Unlimited translations",
      "4K quality",
      "24/7 support",
      "All rural dialects",
      "Custom voice options",
      "API access"
    ],
    popular: false
  },
  {
    name: "Custom",
    price: "Contact",
    period: "for pricing",
    features: [
      "Custom solution",
      "Dedicated support",
      "SLA guarantee",
      "Custom integration",
      "White-label option"
    ],
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-16">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 ${
                plan.popular ? 'transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-purple-400">{plan.price}</span>
                <span className="text-gray-400 ml-2">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`block text-center py-2 px-4 rounded-lg transition-colors ${
                  plan.popular
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}