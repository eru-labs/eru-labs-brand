// File: src/components/sections/hero.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, FileText, Users } from 'lucide-react';
import Link from 'next/link';
import { useERULabsData } from '../providers/data-provider';

export default function Hero() {
  const { config, githubStats, zenodoStats, loading } = useERULabsData();

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
    {/* Animated background particles */}
    <div className="absolute inset-0">
        {[...Array(150)].map((_, i) => (
        <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-500 rounded-full"
            initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            opacity: Math.random() * 0.8 + 0.2, // More visible particles
            }}
            animate={{
            y: [null, -100],
            opacity: [null, 0],
            }}
            transition={{
            duration: Math.random() * 15 + 5, // Varied speeds
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 2, // Stagger start times
            }}
            style={{
            willChange: 'transform, opacity', // Optimize for animations
            }}
        />
        ))}
    </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8"
          >
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Advancing AI Through
            <span className="block text-green-600 glow-text">Open Research</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            We're a small collective of researchers, SREs, hackers, artists and dreamers exploring multi-agent systems, 
            neural architecture search, and production-informed AI. Our work is open source 
            and driven by curiosity, ethics, and the democratization of technology.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-700 animate-pulse rounded"></span>
                ) : (
                  zenodoStats.downloads.toLocaleString()
                )}
              </div>
              <div className="text-sm text-gray-500">Paper Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-700 animate-pulse rounded"></span>
                ) : (
                  zenodoStats.views.toLocaleString()
                )}
              </div>
              <div className="text-sm text-gray-500">Paper Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-700 animate-pulse rounded"></span>
                ) : (
                  githubStats.projectCount
                )}
              </div>
              <div className="text-sm text-gray-500">Open Source Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-700 animate-pulse rounded"></span>
                ) : (
                  githubStats.stars.toLocaleString()
                )}
              </div>
              <div className="text-sm text-gray-500">GitHub Stars</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="#publications"
              className="group flex items-center gap-2 px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors"
            >
              <FileText size={20} />
              View Research
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="https://github.com/eru-labs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-gray-700 text-white font-semibold rounded-lg hover:border-green-500 hover:text-green-500 transition-colors"
            >
              <Github size={20} />
              Open Source
            </Link>

            <Link
              href="https://github.com/eru-labs/welcome"
              className="flex items-center gap-2 px-6 py-3 border border-gray-700 text-white font-semibold rounded-lg hover:border-green-500 hover:text-green-500 transition-colors"
            >
              <Users size={20} />
              Collaborate
            </Link>
          </motion.div>

          {/* Featured Research */}
          {config?.hero.featuredPublication && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 p-6 rounded-xl bg-gray-900/50 border border-gray-800"
            >
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <span className="text-green-500">Latest Publication</span>
                <span>•</span>
                <span>3 weeks ago</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {config.hero.featuredPublication.title}
              </h3>
              <p className="text-gray-400 text-sm">
                  When AI agents converse, do they influence each other like humans do?
              </p>
              <Link 
                href={config.hero.featuredPublication.zenodoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-green-500 hover:text-green-400 transition-colors"
              >
                Read on Zenodo
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}