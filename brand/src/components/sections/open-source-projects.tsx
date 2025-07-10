// File: components/OpenSourceProjects.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Github, Star, GitFork, ExternalLink, Code, Users, Zap, Brain, AlertCircle, Calendar, RefreshCw, BotMessageSquare } from 'lucide-react';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  clone_url: string;
  homepage?: string;
}

interface ProjectConfig {
  githubUrl: string;
  category: 'research' | 'framework' | 'tools' | 'infrastructure';
  featured?: boolean;
  customDescription?: string;
  icon?: React.ComponentType<any>;
  demoUrl?: string;
  paperUrl?: string;
  docsUrl?: string;
}

interface ProcessedProject extends GitHubRepo {
  category: string;
  featured: boolean;
  icon: React.ComponentType<any>;
  languageColor: string;
  customDescription?: string;
  links: {
    github: string;
    demo?: string;
    paper?: string;
    docs?: string;
  };
}

const languageColors: Record<string, string> = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Go: '#00ADD8',
  Rust: '#000000',
  Java: '#ED8B00',
  'C++': '#00599C',
  C: '#A8B9CC',
  PHP: '#777BB4',
  Ruby: '#CC342D',
  Swift: '#FA7343',
  Kotlin: '#0095D5',
  Dart: '#0175C2',
  Jupyter: '#DA5B0B',
  Shell: '#89E051',
  HTML: '#E34F26',
  CSS: '#1572B6',
};

const categoryIcons = {
  research: Brain,
  framework: Users,
  tools: Zap,
  infrastructure: Code,
};

const useGitHubProjects = (projectConfigs: ProjectConfig[]) => {
  const [projects, setProjects] = useState<ProcessedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  const CACHE_KEY = 'eru-labs-github-projects';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const fetchProjects = async (forceRefresh = false) => {
    if (projectConfigs.length === 0) {
      setLoading(false);
      return;
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh && typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            console.log('Using cached GitHub data');
            setProjects(data);
            setLastFetch(timestamp);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to load cache:', err);
      }
    }

    setLoading(true);
    setError(null);

    try {
      const repoUrls = projectConfigs.map(config => config.githubUrl).join(',');
      
      console.log('Fetching fresh GitHub data...');
      
      // Fetch from our API route instead of GitHub directly
      const response = await fetch(`/api/github-projects?repos=${encodeURIComponent(repoUrls)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || `API error: ${response.statusText}`);
      }

      const githubRepos: GitHubRepo[] = await response.json();

      // Merge GitHub data with our project configs
      const processedProjects: ProcessedProject[] = githubRepos.map((repo) => {
        // Find matching config by comparing GitHub URLs
        const config = projectConfigs.find(c => 
          c.githubUrl.includes(repo.full_name) || 
          repo.html_url.includes(c.githubUrl.split('/').slice(-2).join('/'))
        );
        
        if (!config) {
          console.warn(`No config found for repo: ${repo.full_name}`);
          return null;
        }
        
        return {
          ...repo,
          category: config.category,
          featured: config.featured || false,
          icon: config.icon || categoryIcons[config.category],
          languageColor: languageColors[repo.language] || '#6B7280',
          customDescription: config.customDescription,
          links: {
            github: repo.html_url,
            ...(config.demoUrl && { demo: config.demoUrl }),
            ...(config.paperUrl && { paper: config.paperUrl }),
            ...(config.docsUrl && { docs: config.docsUrl }),
            ...(repo.homepage && { demo: repo.homepage }),
          },
        };
      }).filter(Boolean) as ProcessedProject[];

      setProjects(processedProjects);
      
      const now = Date.now();
      setLastFetch(now);

      // Cache the results
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: processedProjects,
            timestamp: now,
          }));
        } catch (err) {
          console.warn('Failed to cache data:', err);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      console.error('Error fetching GitHub projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []); // Only run once on mount

  return { projects, loading, error, lastFetch, refetch: () => fetchProjects(true) };
};

const OpenSourceProjects = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Configure your projects here - just add GitHub URLs and metadata
  const projectConfigs: ProjectConfig[] = [
    {
      githubUrl: 'https://github.com/im-knots/the-academy',
      category: 'infrastructure',
      featured: true,
      icon: Brain,
      customDescription: 'Research platform for studying multi-agent AI interactions and peer pressure dynamics',
    },
    {
      githubUrl: 'https://github.com/im-knots/ea-monorepo',
      category: 'infrastructure',
      icon: Users,
      customDescription: 'Modular AI orchestration platform for building complex agent-based workflows',
      docsUrl: '#docs',
    },
    {
      githubUrl: 'https://github.com/im-knots/gvft',
      category: 'framework',
      icon: Brain,
      customDescription: 'Gestalt Vector Field Theory - Novel framework for evolving neural architectures using field theoretic concepts',
    },
    {
      githubUrl: 'https://github.com/im-knots/the-academy',
      category: 'research',
      icon: Brain,
      customDescription: 'This is Your AI on Peer Pressure: An Observational Study of Inter-Agent Social Dynamics',
      paperUrl: 'https://zenodo.org/records/15724141',
    },
  ];

  const { projects, loading, error, lastFetch, refetch } = useGitHubProjects(projectConfigs);

  const categories = [
    { id: 'all', name: 'All Projects', count: projects.length },
    { id: 'research', name: 'Research', count: projects.filter(p => p.category === 'research').length },
    { id: 'framework', name: 'Frameworks', count: projects.filter(p => p.category === 'framework').length },
    { id: 'tools', name: 'Tools', count: projects.filter(p => p.category === 'tools').length },
    { id: 'infrastructure', name: 'Infrastructure', count: projects.filter(p => p.category === 'infrastructure').length }
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <section className="py-24 bg-gray-900" id="open-source">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Open Source Projects
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Contributing to the AI community with production-tested tools and 
              cutting-edge research implementations
            </p>
          </div>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-green-400"></div>
            <p className="text-gray-300 mt-4">Loading projects from GitHub...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gray-900" id="open-source">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Open Source Projects
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Contributing to the AI community with production-tested tools and 
              cutting-edge research implementations
            </p>
          </div>
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-300 mb-2">Error loading projects</p>
            <p className="text-gray-400 text-sm max-w-md mx-auto">{error}</p>
            <button 
              onClick={() => refetch()} 
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-900" id="open-source">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Open Source Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Contributing to the AI community with production-tested tools and 
            cutting-edge research implementations
          </p>
          {lastFetch && (
            <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
              Last updated: {new Date(lastFetch).toLocaleString()}
              <button 
                onClick={() => refetch()}
                className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name}
              <span className="ml-2 text-sm opacity-75">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => {
            const Icon = project.icon;
            return (
              <div
                key={project.id}
                className={`group relative bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 ${
                  project.featured ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-gray-900' : ''
                }`}
                style={{
                  animation: `slideIn 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-700 rounded-xl group-hover:bg-gray-600 transition-colors">
                        <Icon className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center mt-1 space-x-2">
                          {project.language && (
                            <>
                              <span 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: project.languageColor }}
                              />
                              <span className="text-sm text-gray-400">{project.language}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6 line-clamp-2">
                    {project.customDescription || project.description || 'No description available'}
                  </p>

                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-300 text-sm">{project.stargazers_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GitFork className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{project.forks_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span className="text-gray-300 text-sm">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-wrap gap-2">
                    {Object.entries(project.links).map(([type, link]) => (
                      <a
                        key={type}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 group/link"
                      >
                        {type === 'github' && <Github className="w-4 h-4 text-gray-300 group-hover/link:text-white" />}
                        {type === 'demo' && <ExternalLink className="w-4 h-4 text-gray-300 group-hover/link:text-white" />}
                        {(type === 'docs' || type === 'paper') && <Code className="w-4 h-4 text-gray-300 group-hover/link:text-white" />}
                        <span className="text-sm text-gray-300 group-hover/link:text-white capitalize">
                          {type}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 via-green-600/0 to-green-600/0 group-hover:from-green-600/10 group-hover:via-emerald-600/10 group-hover:to-teal-600/10 transition-all duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a
            href="https://github.com/im-knots"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-600/25"
          >
            <Github className="w-5 h-5" />
            <span>View All Projects on GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default OpenSourceProjects;