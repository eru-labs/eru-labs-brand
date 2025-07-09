'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, FileText, Users } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-500 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random(),
            }}
            animate={{
              y: [null, -100],
              opacity: [null, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
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
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">Open Research Initiative</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Advancing AI Through
            <span className="block text-green-500 glow-text">Open Research</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            We're a small team of researchers exploring multi-agent systems, 
            emergent behaviors, and production-informed AI. Our work is open source 
            and driven by curiosity.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">569</div>
              <div className="text-sm text-gray-500">Paper Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">12</div>
              <div className="text-sm text-gray-500">Open Source Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">3</div>
              <div className="text-sm text-gray-500">Active Research Areas</div>
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
              href="/research"
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
              href="#collaborate"
              className="flex items-center gap-2 px-6 py-3 border border-gray-700 text-white font-semibold rounded-lg hover:border-green-500 hover:text-green-500 transition-colors"
            >
              <Users size={20} />
              Collaborate
            </Link>
          </motion.div>

          {/* Featured Research */}
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
              Peer Pressure: Leveraging LLM Ensembles for Improved Accuracy
            </h3>
            <p className="text-gray-400 text-sm">
              Exploring how multi-agent deliberation can enhance AI decision-making through collaborative reasoning.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}