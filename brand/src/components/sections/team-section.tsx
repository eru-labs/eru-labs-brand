import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const TeamSection = () => {
  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Principal Research Scientist",
      bio: "Leading research in multi-agent orchestration and emergent behaviors in AI systems",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
        email: "sarah@erulabs.ai"
      }
    },
    {
      name: "Alex Kumar",
      role: "Senior AI Engineer",
      bio: "Specializing in production-scale AI systems and distributed agent architectures",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
        email: "alex@erulabs.ai"
      }
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Research Scientist",
      bio: "Investigating peer pressure dynamics in multi-agent systems and collaborative AI",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      social: {
        github: "#",
        linkedin: "#",
        email: "maria@erulabs.ai"
      }
    },
    {
      name: "James Thompson",
      role: "Machine Learning Engineer",
      bio: "Building scalable infrastructure for agent-based AI research and experimentation",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    email: Mail
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Research Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Passionate researchers and engineers working at the intersection of 
            multi-agent systems, AI orchestration, and emergent behaviors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={member.name}
              className="group relative"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-indigo-600 mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                  
                  <div className="flex space-x-3">
                    {Object.entries(member.social).map(([platform, link]) => {
                      const Icon = socialIcons[platform];
                      return (
                        <a
                          key={platform}
                          href={link}
                          className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                          aria-label={`${member.name}'s ${platform}`}
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-xl">
            <p className="text-gray-700">
              Interested in joining our team? 
              <a href="#careers" className="ml-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                View open positions →
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default TeamSection;