// File: src/components/sections/team-section.tsx
import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Mail, Loader2 } from 'lucide-react';
import { useERULabsData } from '../providers/data-provider';

const TeamSection = () => {
  const { config, loading, error } = useERULabsData();
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    email: Mail
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white" id="team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-xl text-gray-400">
              <Loader2 className="animate-spin" size={24} />
              Loading team...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !config?.team) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white" id="team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-400 text-lg">
              Error loading team information
            </div>
            <p className="text-gray-500 mt-2">
              Please check the configuration and try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const team = config.team;

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {team.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {team.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.members.map((member, index) => {
            const isHovered = hoveredMember === member.name;
            
            return (
              <div
                key={member.name}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
                onMouseEnter={() => setHoveredMember(member.name)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className={`bg-white rounded-2xl shadow-lg transition-all duration-500 overflow-hidden relative ${
                  isHovered 
                    ? 'transform scale-110 shadow-2xl z-10' 
                    : 'transform hover:-translate-y-2 hover:shadow-2xl h-[480px]'
                }`}>
                  
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className={`p-6 transition-all duration-300 ${isHovered ? 'pb-8' : ''}`}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-indigo-600 mb-3">
                      {member.role}
                    </p>
                    
                    {/* Bio Text - Full when hovered, truncated otherwise with consistent height */}
                    <div className={`mb-4 transition-all duration-300 ${isHovered ? 'h-auto' : 'h-16'}`}>
                      <p className={`text-gray-600 text-sm transition-all duration-300 ${
                        isHovered ? 'line-clamp-none' : 'line-clamp-3'
                      }`}>
                        {member.bio}
                      </p>
                    </div>
                    
                    {/* Contact Info - Prominent when hovered */}
                    {isHovered && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Contact</h4>
                        <div className="space-y-1">
                          {member.social.email && (
                            <a 
                              href={`mailto:${member.social.email}`}
                              className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              {member.social.email}
                            </a>
                          )}
                          {member.social.github && member.social.github !== '#' && (
                            <a 
                              href={member.social.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                              <Github className="w-4 h-4 mr-2" />
                              View GitHub Profile
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Social Icons - Exclude GitHub and Email since they're in contact section */}
                    <div className="flex space-x-3">
                      {Object.entries(member.social)
                        .filter(([platform, link]) => 
                          link && 
                          link !== '#' && 
                          platform !== 'github' && 
                          platform !== 'email'
                        )
                        .map(([platform, link]) => {
                          const Icon = socialIcons[platform as keyof typeof socialIcons];
                          if (!Icon) return null;
                          
                          return (
                            <a
                              key={platform}
                              href={link}
                              className={`transition-all duration-200 ${
                                isHovered 
                                  ? 'text-indigo-600 hover:text-indigo-700 transform scale-110' 
                                  : 'text-gray-400 hover:text-indigo-600'
                              }`}
                              aria-label={`${member.name}'s ${platform}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Icon className="w-5 h-5" />
                            </a>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {team.callToAction && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-xl">
              <p className="text-gray-700">
                {team.callToAction.text}
                <a 
                  href={team.callToAction.linkUrl} 
                  className="ml-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  {team.callToAction.linkText}
                </a>
              </p>
            </div>
          </div>
        )}
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

        .line-clamp-none {
          display: block;
          -webkit-line-clamp: unset;
          -webkit-box-orient: unset;
          overflow: visible;
        }
      `}</style>
    </section>
  );
};

export default TeamSection;