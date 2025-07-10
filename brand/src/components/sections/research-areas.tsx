'use client';

import { motion } from 'framer-motion';
import { Brain, Network, Cpu, GitBranch } from 'lucide-react';

const researchAreas = [
  {
    icon: Brain,
    title: 'Multi-Agent Systems',
    description: 'Exploring emergent behaviors in collaborative AI systems where multiple agents work together to solve complex problems.',
    topics: ['Agent Communication', 'Collective Intelligence', 'Consensus Mechanisms', 'Distributed Agent Architectures'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Network,
    title: 'Emergent Behaviors',
    description: 'Investigating how simple rules and interactions lead to complex, unpredictable behaviors in AI systems.',
    topics: ['Self-Organization', 'Swarm Intelligence', 'Adaptive Systems', 'Peer-Pressure Dynamics'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Cpu,
    title: 'Production-Informed Research',
    description: 'Bridging the gap between theoretical AI research and real-world production systems.',
    topics: ['Scalability', 'Reliability', 'Performance Optimization', 'Multi-Agent Orchestration', 'Safety Alignment', 'Data Security'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: GitBranch,
    title: 'Open Source AI Tools',
    description: 'Building and maintaining open source tools that enable researchers and developers to advance AI.',
    topics: ['The Ea Platform', 'The Academy', 'GVFT Framework'],
    color: 'from-orange-500 to-red-500',
  },
];

export default function ResearchAreas() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Research Areas
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our research focuses on understanding and advancing artificial intelligence 
            through practical, ethical, open approaches.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {researchAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative group h-full">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />
                
                <div className="relative p-8 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300 h-full card-hover">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${area.color} bg-opacity-10`}>
                      <area.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{area.title}</h3>
                      <p className="text-gray-400 mb-4">{area.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase">Focus Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {area.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}