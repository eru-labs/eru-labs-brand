// File: src/components/sections/mission-section.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useERULabsData } from '../providers/data-provider';
import { getIconComponent } from '@/lib/config';

const MissionSection = () => {
  const { config, loading, error } = useERULabsData();

  if (loading) {
    return (
      <section className="py-24 bg-gray-950" id="mission">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-xl text-gray-400">
              <Loader2 className="animate-spin" size={24} />
              Loading mission...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !config?.mission) {
    return (
      <section className="py-24 bg-gray-950" id="mission">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-400 text-lg">
              Error loading mission information
            </div>
            <p className="text-gray-500 mt-2">
              Please check the configuration and try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const mission = config.mission;

  return (
    <section className="py-24 bg-gray-950" id="mission">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            {mission.title}
          </h2>
          <p className="text-xl text-green-500 font-semibold mb-6">
            {mission.subtitle}
          </p>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {mission.description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-900 rounded-2xl p-8 border border-gray-800"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              {mission.vision.title}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {mission.vision.content}
            </p>
          </motion.div>

          {/* Goals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gray-900 rounded-2xl p-8 border border-gray-800"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Key Goals
            </h3>
            <ul className="space-y-3">
              {mission.goals.map((goal, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{goal}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Our Values
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mission.values.map((value, index) => {
              const IconComponent = getIconComponent(value.icon);
              
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-green-500/50 transition-all duration-300 group"
                >
                  <h4 className="text-lg font-semibold text-white mb-3">
                    {value.title}
                  </h4>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 border border-green-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join Our Mission
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Whether you're a researcher, engineer, or simply passionate about ethical AI, 
              there are many ways to contribute to our open science initiatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#team"
                className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors"
              >
                Meet the Team
              </a>
              <a
                href="#open-source"
                className="px-6 py-3 border border-gray-600 text-white font-semibold rounded-lg hover:border-green-500 hover:text-green-500 transition-colors"
              >
                Explore Our Work
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;