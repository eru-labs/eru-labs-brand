"use client";

import React from 'react';
import { 
  Brain, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  MapPin, 
  FileText,
  Users,
  Code,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    research: {
      title: 'Research',
      icon: Brain,
      links: [
        { name: 'Multi-Agent Systems', href: '#multi-agent' },
        { name: 'AI Orchestration', href: '#orchestration' },
        { name: 'Emergent Behaviors', href: '#emergent' },
        { name: 'Publications', href: '#publications' },
        { name: 'Research Blog', href: '#blog' }
      ]
    },
    openSource: {
      title: 'Open Source',
      icon: Code,
      links: [
        { name: 'GitHub', href: 'https://github.com/eru-labs', external: true },
        { name: 'Projects', href: '#projects' },
        { name: 'Contributing', href: '#contributing' },
        { name: 'Documentation', href: '#docs' },
        { name: 'License', href: '#license' }
      ]
    },
    community: {
      title: 'Community',
      icon: Users,
      links: [
        { name: 'IRC', href: '#irc', external: true },
        { name: 'Bluesky', href: '#bluesky', external: true },
        { name: 'Newsletter', href: '#newsletter' },
        { name: 'Events', href: '#events' },
        { name: 'Forum', href: '#forum' }
      ]
    },
    company: {
      title: 'Company',
      icon: FileText,
      links: [
        { name: 'About Us', href: '#about' },
        { name: 'Careers', href: '#careers', badge: '3 openings' },
        { name: 'Contact', href: '#contact' },
        { name: 'Privacy Policy', href: '#privacy' }
      ]
    }
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/eru-labs', label: 'GitHub' },
    { icon: Twitter, href: 'https://bluesky.com/eru-labs', label: 'bluesky' },
    { icon: Linkedin, href: 'https://linkedin.com/company/eru-labs', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:info@erulabs.ai', label: 'Email' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated with Our Research
            </h3>
            <p className="text-gray-400 mb-6">
              Get weekly insights on multi-agent systems, AI orchestration, and our latest findings
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
              />
              <button
                onClick={() => console.log('Subscribe clicked')}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/25"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Eru Labs</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm">
              Independent AI research lab focused on multi-agent systems and emergent behaviors
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Brooklyn, NY</span>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, section]) => {
            const Icon = section.icon;
            return (
              <div key={key}>
                <div className="flex items-center space-x-2 mb-4">
                  <Icon className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-white font-semibold">{section.title}</h4>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center justify-between group"
                      >
                        <span>{link.name}</span>
                        {link.external && (
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                        {link.badge && (
                          <span className="px-2 py-1 bg-indigo-600/20 text-indigo-400 text-xs rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {currentYear} Eru Labs. All rights reserved. Open source under MIT License.
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </footer>
  );
};

export default Footer;