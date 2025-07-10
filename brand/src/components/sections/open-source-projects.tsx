// File: components/sections/open-source-projects.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Github, Star, GitFork, ExternalLink, Code, Users, Zap, Brain, AlertCircle, Calendar, RefreshCw, Download, FileText } from 'lucide-react';

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

interface ZenodoRecord {
  id: string;
  metadata: {
    title: string;
    creators: Array<{ name: string }>;
    publication_date: string;
    description: string;
    keywords?: string[];
    doi: string;
    resource_type: {
      title: string;
      type: string;
    };
  };
  stats: {
    downloads: number;
    views: number;
  };
  links: {
    self_html: string;
    files?: string;
  };
  files?: Array<{
    key: string;
    links: {
      self: string;
    };
    type: string;
    size: number;
  }>;
}

interface ProjectConfig {
  // Can be either GitHub URL or Zenodo URL
  sourceUrl: string;
  sourceType: 'github' | 'zenodo';
  category: 'research' | 'framework' | 'tools' | 'infrastructure';
  featured?: boolean;
  customDescription?: string;
  icon?: React.ComponentType<any>;
  demoUrl?: string;
  paperUrl?: string;
  docsUrl?: string;
  githubUrl?: string; // For Zenodo records that also have GitHub repos
}

interface ProcessedProject {
  id: string;
  name: string;
  description: string;
  sourceType: 'github' | 'zenodo';
  category: string;
  featured: boolean;
  icon: React.ComponentType<any>;
  languageColor?: string;
  customDescription?: string;
  updated_at: string;
  
  // GitHub-specific fields
  stargazers_count?: number;
  forks_count?: number;
  language?: string;
  topics?: string[];
  
  // Zenodo-specific fields
  downloads?: number;
  views?: number;
  authors?: string[];
  doi?: string;
  resourceType?: string;
  
  links: {
    source: string; // Main source URL (GitHub or Zenodo)
    github?: string;
    demo?: string;
    paper?: string;
    docs?: string;
    download?: string; // For Zenodo PDF downloads
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

const useMultiSourceProjects = (projectConfigs: ProjectConfig[]) => {
  const [projects, setProjects] = useState<ProcessedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  const CACHE_KEY = 'eru-labs-projects-v2'; // Updated version to clear old cache
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const fetchGitHubRepos = async (urls: string[]): Promise<GitHubRepo[]> => {
    const repoUrls = urls.join(',');
    console.log('Fetching GitHub data via API route...');
    
    // Use your existing API route to avoid CORS issues
    const response = await fetch(`/api/github-projects?repos=${encodeURIComponent(repoUrls)}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || `API error: ${response.statusText}`);
    }

    return response.json();
  };

  const fetchZenodoRecord = async (url: string): Promise<ZenodoRecord> => {
    const match = url.match(/zenodo\.org\/records?\/(\d+)/);
    if (!match) throw new Error(`Invalid Zenodo URL: ${url}`);
    
    const recordId = match[1];
    const response = await fetch(`https://zenodo.org/api/records/${recordId}`);
    if (!response.ok) throw new Error(`Zenodo API error: ${response.statusText}`);
    
    return response.json();
  };

  const processGitHubProject = (repo: GitHubRepo, config: ProjectConfig): ProcessedProject => {
    const pdfFile = undefined; // GitHub repos don't have direct PDF files in this context
    
    return {
      id: repo.id.toString(),
      name: repo.name,
      description: config.customDescription || repo.description || 'No description available',
      sourceType: 'github',
      category: config.category,
      featured: config.featured || false,
      icon: config.icon || categoryIcons[config.category], // Don't cache this
      languageColor: languageColors[repo.language] || '#6B7280',
      customDescription: config.customDescription,
      updated_at: repo.updated_at,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language,
      topics: repo.topics,
      links: {
        source: repo.html_url,
        github: repo.html_url,
        ...(config.demoUrl && { demo: config.demoUrl }),
        ...(config.paperUrl && { paper: config.paperUrl }),
        ...(config.docsUrl && { docs: config.docsUrl }),
        ...(repo.homepage && { demo: repo.homepage }),
      },
    };
  };

  const processZenodoProject = (record: ZenodoRecord, config: ProjectConfig): ProcessedProject => {
    // Find PDF file for download
    const pdfFile = record.files?.find(file => 
      file.type === 'pdf' || file.key.toLowerCase().includes('.pdf')
    );
    
    return {
      id: record.id,
      name: record.metadata.title,
      description: config.customDescription || '', // Only show custom description for Zenodo
      sourceType: 'zenodo',
      category: config.category,
      featured: config.featured || false,
      icon: config.icon || categoryIcons[config.category],
      customDescription: config.customDescription,
      updated_at: record.metadata.publication_date,
      downloads: record.stats.downloads,
      views: record.stats.views,
      authors: record.metadata.creators.map(creator => creator.name),
      doi: record.metadata.doi,
      resourceType: record.metadata.resource_type.title,
      links: {
        source: record.links.self_html,
        paper: record.links.self_html,
        ...(config.githubUrl && { github: config.githubUrl }),
        ...(config.demoUrl && { demo: config.demoUrl }),
        ...(config.docsUrl && { docs: config.docsUrl }),
        ...(pdfFile && { download: pdfFile.links.self }),
      },
    };
  };

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
            console.log('Using cached project data');
            
            // Restore icons from configs since they can't be cached
            const restoredProjects = data.map((cachedProject: any) => {
              const config = projectConfigs.find(c => {
                if (c.sourceType === 'github') {
                  // For GitHub, match by repository name or URL
                  return c.sourceUrl.includes(cachedProject.name) || 
                         cachedProject.id === c.sourceUrl.split('/').pop();
                } else if (c.sourceType === 'zenodo') {
                  // For Zenodo, match by record ID
                  return c.sourceUrl.includes(cachedProject.id);
                }
                return false;
              });
              
              return {
                ...cachedProject,
                icon: config?.icon || categoryIcons[cachedProject.category],
                // Also restore description to ensure zenodo projects have empty descriptions
                description: config?.sourceType === 'zenodo' ? '' : cachedProject.description
              };
            });
            
            setProjects(restoredProjects);
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
      console.log('Fetching fresh project data...');
      
      // Separate GitHub and Zenodo configs
      const githubConfigs = projectConfigs.filter(config => config.sourceType === 'github');
      const zenodoConfigs = projectConfigs.filter(config => config.sourceType === 'zenodo');
      
      const processedProjects: ProcessedProject[] = [];
      
      // Fetch GitHub projects in batch through API route
      if (githubConfigs.length > 0) {
        try {
          const githubUrls = githubConfigs.map(config => config.sourceUrl);
          const githubRepos = await fetchGitHubRepos(githubUrls);
          
          // Process GitHub projects
          githubRepos.forEach((repo) => {
            // Find matching config by comparing GitHub URLs
            const config = githubConfigs.find(c => 
              c.sourceUrl.includes(repo.full_name) || 
              repo.html_url.includes(c.sourceUrl.split('/').slice(-2).join('/'))
            );
            
            if (config) {
              processedProjects.push(processGitHubProject(repo, config));
            } else {
              console.warn(`No config found for repo: ${repo.full_name}`);
            }
          });
        } catch (err) {
          console.error('Failed to fetch GitHub projects:', err);
          // Continue with Zenodo projects even if GitHub fails
        }
      }
      
      // Fetch Zenodo projects individually
      if (zenodoConfigs.length > 0) {
        const zenodoPromises = zenodoConfigs.map(async (config) => {
          try {
            const record = await fetchZenodoRecord(config.sourceUrl);
            return processZenodoProject(record, config);
          } catch (err) {
            console.error(`Failed to fetch Zenodo project ${config.sourceUrl}:`, err);
            return null;
          }
        });
        
        const zenodoResults = await Promise.all(zenodoPromises);
        zenodoResults.forEach(project => {
          if (project) processedProjects.push(project);
        });
      }

      setProjects(processedProjects);
      
      const now = Date.now();
      setLastFetch(now);

      // Cache the results (excluding icons since they can't be serialized)
      if (typeof window !== 'undefined') {
        try {
          const cacheableProjects = processedProjects.map(project => {
            const { icon, ...cacheableProject } = project;
            return cacheableProject;
          });
          
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: cacheableProjects,
            timestamp: now,
          }));
        } catch (err) {
          console.warn('Failed to cache data:', err);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      console.error('Error fetching projects:', err);
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

  // Configure your projects here - supports both GitHub and Zenodo URLs
  const projectConfigs: ProjectConfig[] = [
    {
      sourceUrl: 'https://github.com/im-knots/the-academy',
      sourceType: 'github',
      category: 'infrastructure',
      featured: true,
      icon: Brain,
      customDescription: 'Research platform for studying multi-agent AI interactions and peer pressure dynamics',
    },
    {
      sourceUrl: 'https://github.com/im-knots/ea-monorepo',
      sourceType: 'github',
      category: 'infrastructure',
      icon: Users,
      customDescription: 'Modular AI orchestration platform for building complex agent-based workflows',
      docsUrl: '#docs',
    },
    {
      sourceUrl: 'https://github.com/im-knots/gvft',
      sourceType: 'github',
      category: 'framework',
      icon: Brain,
      customDescription: 'Gestalt Vector Field Theory - Novel framework for evolving neural architectures using field theoretic concepts',
    },
    {
      sourceUrl: 'https://zenodo.org/records/15724141',
      sourceType: 'zenodo',
      category: 'research',
      icon: Brain,
      customDescription: 'This is Your AI on Peer Pressure: An Observational Study of Inter-Agent Social Dynamics',
      githubUrl: 'https://github.com/im-knots/the-academy', // Link to related GitHub repo
    },
  ];

  const { projects, loading, error, lastFetch, refetch } = useMultiSourceProjects(projectConfigs);

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
            <p className="text-gray-300 mt-4">Loading projects from GitHub and Zenodo...</p>
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
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Retrying...
                </>
              ) : (
                'Try Again'
              )}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-900" id="open-source">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Open Source Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Contributing to the AI community with production-tested tools and 
            cutting-edge research implementations
          </p>
        </div>

        {/* Stats Bar */}
        {lastFetch && (
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm">
              Last updated: {new Date(lastFetch).toLocaleString()}
              <button 
                onClick={() => refetch()} 
                className="ml-2 text-green-400 hover:text-green-300 inline-flex items-center"
                disabled={loading}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </p>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => {
            const IconComponent = project.icon;
            
            return (
              <div
                key={project.id}
                className={`relative bg-gray-800 rounded-2xl p-8 hover:bg-gray-750 transition-all duration-300 group ${
                  project.featured 
                    ? 'border-2 border-green-500/60 shadow-2xl shadow-green-500/25' 
                    : 'border border-gray-700 hover:border-gray-600'
                }`}
                style={project.featured ? {
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.1)'
                } : {}}
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${
                      project.featured ? 'bg-green-500/20' : 'bg-gray-700'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        project.featured ? 'text-green-400' : 'text-gray-300'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {project.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.featured 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {project.sourceType.toUpperCase()}
                        </span>
                        {project.language && (
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: project.languageColor }}
                          >
                            {project.language}
                          </span>
                        )}
                        {project.resourceType && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                            {project.resourceType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {project.featured && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                )}

                {/* Project Stats */}
                <div className="flex items-center space-x-6 mb-6">
                  {project.sourceType === 'github' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-300 text-sm">{project.stargazers_count?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GitFork className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{project.forks_count?.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  {project.sourceType === 'zenodo' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-300 text-sm">{project.downloads?.toLocaleString()} downloads</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{project.views?.toLocaleString()} views</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300 text-sm">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Authors (for Zenodo records) */}
                {project.authors && project.authors.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Authors:</h4>
                    <p className="text-gray-300 text-sm">{project.authors.join(', ')}</p>
                  </div>
                )}

                {/* Action Links */}
                <div className="flex items-center space-x-3 flex-wrap gap-2">
                  {Object.entries(project.links)
                    .filter(([type]) => type !== 'source') // Don't show redundant source button
                    .map(([type, link]) => {
                    const linkConfig = {
                      github: { icon: Github, label: 'GitHub' },
                      demo: { icon: ExternalLink, label: 'Demo' },
                      paper: { icon: FileText, label: 'Paper' },
                      docs: { icon: FileText, label: 'Docs' },
                      download: { icon: Download, label: 'Download' },
                    };

                    const config = linkConfig[type as keyof typeof linkConfig];
                    if (!config) return null;

                    const Icon = config.icon;

                    return (
                      <a
                        key={type}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 group/link"
                      >
                        <Icon className="w-4 h-4 text-gray-300 group-hover/link:text-white" />
                        <span className="text-gray-300 group-hover/link:text-white text-sm">
                          {config.label}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OpenSourceProjects;