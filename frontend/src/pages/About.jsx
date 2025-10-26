import React from 'react';
import { FiTarget, FiHeart, FiTrendingUp } from 'react-icons/fi';

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">About Zero Waste Marketplace</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            We're on a mission to reduce waste and promote sustainable consumption
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700">
              We connect businesses with surplus inventory to conscious consumers,
              reducing waste while making quality products more accessible. Every
              purchase on our platform contributes to SDG Goal 12: Responsible
              Consumption and Production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <FiTarget className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-gray-600">
                A world where nothing goes to waste and sustainable consumption is the norm.
              </p>
            </div>
            <div className="card p-6 text-center">
              <FiHeart className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Our Values</h3>
              <p className="text-gray-600">
                Sustainability, transparency, and community-driven impact.
              </p>
            </div>
            <div className="card p-6 text-center">
              <FiTrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Our Impact</h3>
              <p className="text-gray-600">
                Over 100 tons of waste prevented and counting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Supporting UN Sustainable Development Goals
            </h2>
            <div className="card p-8">
              <h3 className="text-2xl font-semibold mb-4 text-primary-600">
                SDG 12: Responsible Consumption and Production
              </h3>
              <p className="text-gray-700 mb-4">
                Our platform directly contributes to achieving sustainable consumption and
                production patterns by:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Reducing food waste and surplus inventory</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Promoting circular economy principles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Making sustainable choices more accessible</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Tracking and measuring environmental impact</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;