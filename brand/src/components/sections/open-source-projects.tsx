import React, { useState } from 'react';
import { Github, Star, GitFork, Download, ExternalLink, Code, Users, Zap, Brain } from 'lucide-react';

const OpenSourceProjects = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const projects = [
    {
      name: "Peer Pressure in Multi-Agent Systems",
      description: "Groundbreaking research on emergent behaviors when agents influence each other's decision-making processes",
      category: "research",
      stars: 342,
      forks: 89,
      downloads: 569,
      language: "Python",
      languageColor: "#3776AB",
      icon: Brain,
      featured: true,
      links: {
        github: "https://github.com/erulabs/peer-pressure-agents",
        paper: "#",
        demo: "#"
      }
    },
    {
      name: "Agent Orchestration Framework",
      description: "Production-ready framework for orchestrating multiple AI agents with built-in collaboration patterns",
      category: "framework",
      stars: 1203,
      forks: 234,
      downloads: 3421,
      language: "TypeScript",
      languageColor: "#3178C6",
      icon: Users,
      links: {
        github: "https://github.com/erulabs/agent-orchestration",
        docs: "#"
      }
    },
    {
      name: "Emergent Behavior Simulator",
      description: "Visual simulator for studying emergent behaviors in multi-agent systems",
      category: "tools",
      stars: 567,
      forks: 123,
      downloads: 892,
      language: "JavaScript",
      languageColor: "#F7DF1E",
      icon: Zap,
      links: {
        github: "https://github.com/erulabs/emergent-sim",
        demo: "#"
      }
    },
    {
      name: "Distributed Agent Runtime",
      description: "High-performance runtime for deploying agent systems at scale",
      category: "infrastructure",
      stars: 892,
      forks: 178,
      downloads: 2103,
      language: "Go",
      languageColor: "#00ADD8",
      icon: Code,
      links: {
        github: "https://github.com/erulabs/agent-runtime",
        docs: "#"
      }
    }
  ];

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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
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
                key={project.name}
                className={`group relative bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 ${
                  project.featured ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900' : ''
                }`}
                style={{
                  animation: `slideIn 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-700 rounded-xl group-hover:bg-gray-600 transition-colors">
                        <Icon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center mt-1 space-x-2">
                          <span 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: project.languageColor }}
                          />
                          <span className="text-sm text-gray-400">{project.language}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-300 text-sm">{project.stars}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GitFork className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{project.forks}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4 text-green-500" />
                      <span className="text-gray-300 text-sm">{project.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {Object.entries(project.links).map(([type, link]) => (
                      <a
                        key={type}
                        href={link}
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
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a
            href="https://github.com/erulabs"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-600/25"
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