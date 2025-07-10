// File: src/components/sections/footer.tsx
"use client";

import React from 'react';
import { 
  ArrowUpRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Research', href: '#publications' },
    { name: 'Open Source', href: '#open-source' },
    { name: 'Team', href: '#team' },
    { name: 'Mission', href: '#mission' }
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
              Get updates on multi-agent AI systems, emergent behaviors, and our latest open source projects
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
              />
              <button
                onClick={() => console.log('Subscribe clicked')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-black font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-600/25"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              {/* Logo */}
              <img 
                src="/img/logo.png" 
                alt="Eru Labs Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-white">Eru Labs</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              A collective of hackers, researchers, artists, and dreamers exploring multi-agent AI systems 
              and building technology that serves humanity.
            </p>
            <p className="text-gray-500 text-xs">
              Radically open source • IRC culture • Digital freedom
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="space-y-3 mb-6">
              <a 
                href="mailto:info@erulabs.ai" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm block"
              >
                info@erulabs.ai
              </a>
              <div className="text-gray-400 text-sm">
                #erulabs on libera IRC network
              </div>
              <a 
                href="https://github.com/eru-labs" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm block flex items-center"
              >
                GitHub Organization
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {currentYear} Eru Labs. All rights reserved. Open source under MIT License.
          </div>
          
          <div className="text-sm text-gray-500">
            Built with love in every line :)
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;