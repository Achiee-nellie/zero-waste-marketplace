import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for getting started',
      features: [
        'Up to 5 product listings',
        'Basic analytics',
        'Standard support',
        '15% commission per sale',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Basic',
      price: '29',
      description: 'For growing businesses',
      features: [
        'Up to 50 product listings',
        '5 featured listings per month',
        'Advanced analytics',
        'Priority support',
        '12% commission per sale',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: '59',
      description: 'For established sellers',
      features: [
        'Up to 200 product listings',
        '20 featured listings per month',
        'Advanced analytics & insights',
        'Priority support',
        'Custom branding',
        '10% commission per sale',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Enterprise',
      price: '99',
      description: 'For large-scale operations',
      features: [
        'Unlimited product listings',
        '50 featured listings per month',
        'Full analytics suite',
        'Dedicated account manager',
        'Custom branding',
        'API access',
        '8% commission per sale',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Choose the perfect plan for your business
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`card p-6 ${
                  plan.highlighted
                    ? 'ring-2 ring-primary-600 transform scale-105'
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mt-4 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <FiCheck className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`btn w-full ${
                    plan.highlighted ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-semibold mb-2">Can I change my plan later?</h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time from your dashboard.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, debit cards, and bank transfers through Stripe.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="font-semibold mb-2">Is there a contract?</h3>
                <p className="text-gray-600">
                  No, all our plans are month-to-month with no long-term commitment required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
