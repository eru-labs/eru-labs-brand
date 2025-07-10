'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, FileText, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ZenodoStats {
  downloads: number;
  views: number;
}

interface GitHubStats {
  stars: number;
  forks: number;
  projectCount: number;
}

export default function Hero() {
  const [stats, setStats] = useState<ZenodoStats>({ downloads: 0, views: 0 });
  const [githubStats, setGithubStats] = useState<GitHubStats>({ stars: 0, forks: 0, projectCount: 0 });
  const [loading, setLoading] = useState(true);

  // Add Zenodo record IDs here
  const zenodoRecordIds = [
    '15724141',
  ];

  // Add GitHub repository URLs here
  const githubRepos = [
    'https://github.com/im-knots/ea-monorepo',
    'https://github.com/im-knots/the-academy',
    'https://github.com/im-knots/gvft',
  ];

  useEffect(() => {
    const fetchZenodoStats = async () => {
      try {
        const promises = zenodoRecordIds.map(async (id) => {
          const response = await fetch(`https://zenodo.org/api/records/${id}`);
          if (!response.ok) throw new Error(`Failed to fetch record ${id}`);
          const data = await response.json();
          
          return {
            downloads: data.stats?.downloads || 0,
            views: data.stats?.views || 0,
          };
        });

        const results = await Promise.all(promises);
        
        // Aggregate stats
        const totalStats = results.reduce(
          (acc, curr) => ({
            downloads: acc.downloads + curr.downloads,
            views: acc.views + curr.views,
          }),
          { downloads: 0, views: 0 }
        );

        setStats(totalStats);
      } catch (error) {
        console.error('Error fetching Zenodo stats:', error);
        // Fallback to default values on error
      }
    };

    const fetchGitHubStats = async () => {
      try {
        const promises = githubRepos.map(async (url) => {
          // Extract owner and repo from URL
          const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
          if (!match) throw new Error(`Invalid GitHub URL: ${url}`);
          
          const [, owner, repo] = match;
          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
          if (!response.ok) throw new Error(`Failed to fetch repo ${owner}/${repo}`);
          const data = await response.json();
          
          return {
            stars: data.stargazers_count || 0,
            forks: data.forks_count || 0,
          };
        });

        const results = await Promise.all(promises);
        
        // Aggregate GitHub stats
        const totalGithubStats = results.reduce(
          (acc, curr) => ({
            stars: acc.stars + curr.stars,
            forks: acc.forks + curr.forks,
          }),
          { stars: 0, forks: 0 }
        );

        setGithubStats({
          ...totalGithubStats,
          projectCount: githubRepos.length,
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Fallback to default values
        setGithubStats({ stars: 0, forks: 0, projectCount: githubRepos.length });
      }
    };

    const fetchAllStats = async () => {
      await Promise.all([fetchZenodoStats(), fetchGitHubStats()]);
      setLoading(false);
    };

    fetchAllStats();
  }, []);

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
            We're a small collective of researchers, SREs, hackers and dreamers exploring multi-agent systems, 
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
                  stats.downloads.toLocaleString()
                )}
              </div>
              <div className="text-sm text-gray-500">Paper Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-700 animate-pulse rounded"></span>
                ) : (
                  stats.views.toLocaleString()
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
              href="/research"
              className="group flex items-center gap-2 px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors"
            >
              <FileText size={20} />
              View Research
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="https://github.com/im-knots"
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
              This is Your AI on Peer Pressure: An Observational Study of Inter-Agent Social Dynamics
            </h3>
            <p className="text-gray-400 text-sm">
                When AI agents converse, do they influence each other like humans do?
            </p>
            <Link 
              href="https://zenodo.org/records/15724141"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm text-green-500 hover:text-green-400 transition-colors"
            >
              Read on Zenodo
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}