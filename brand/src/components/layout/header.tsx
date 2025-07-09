"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Github, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    {
      name: 'Research',
      href: '#research',
      dropdown: [
        { name: 'Multi-Agent Systems', href: '#multi-agent' },
        { name: 'AI Orchestration', href: '#orchestration' },
        { name: 'Emergent Behaviors', href: '#emergent' },
        { name: 'Publications', href: '#publications' }
      ]
    },
    {
      name: 'Open Source',
      href: '#open-source',
      dropdown: [
        { name: 'Projects', href: '#projects' },
        { name: 'Contributions', href: '#contributions' },
        { name: 'Documentation', href: '#docs' }
      ]
    },
    {
      name: 'Team',
      href: '#team'
    },
    {
      name: 'Blog',
      href: '#blog'
    },
    {
      name: 'About',
      href: '#about',
      dropdown: [
        { name: 'Mission', href: '#mission' },
        { name: 'Careers', href: '#careers' },
        { name: 'Contact', href: '#contact' }
      ]
    }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className={`relative transition-all duration-300 ${
                isScrolled ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
              }`}>
                <Image 
                  src="/img/logo.png" 
                  alt="Eru Labs Logo" 
                  width={90} 
                  height={90} 
                  priority={true}
                  className={`object-contain transition-all duration-300 ${
                    isScrolled 
                      ? 'brightness-100 invert' 
                      : 'brightness-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                  }`}
                />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                Eru Labs
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div 
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === item.name ? 'rotate-180' : ''
                    }`} />
                  )}
                </a>
                
                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden transform origin-top animate-dropdown">
                    <div className="py-2">
                      {item.dropdown.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* GitHub Link */}
            <a
              href="https://github.com/eru-labs"
              className={`ml-4 flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isScrolled
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-2xl overflow-hidden animate-slideDown">
            <div className="px-4 py-6 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <a
                    href={item.href}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                  {item.dropdown && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.dropdown.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <a
                href="https://github.com/eru-labs"
                className="flex items-center justify-center px-4 py-3 mt-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;