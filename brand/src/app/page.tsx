'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/sections/hero';
import ResearchAreas from '@/components/sections/research-areas';
import Publications from '@/components/sections/publications';
import TeamSection from '@/components/sections/team-section';
import OpenSourceProjects from '@/components/sections/open-source-projects';

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [skipIntro, setSkipIntro] = useState(false);

  useEffect(() => {
    // Check if user has seen intro before
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowIntro(false);
    }

    // Handle skip on Enter key
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showIntro) {
        setSkipIntro(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showIntro]);

  useEffect(() => {
    if (skipIntro) {
      localStorage.setItem('hasSeenIntro', 'true');
      setTimeout(() => setShowIntro(false), 500);
    }
  }, [skipIntro]);

  if (showIntro) {
    return <IntroSequence onComplete={() => setShowIntro(false)} skip={skipIntro} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <ResearchAreas />
      <Publications />
      <OpenSourceProjects />
      <TeamSection />
    </motion.div>
  );
}

function IntroSequence({ onComplete, skip }: { onComplete: () => void; skip: boolean }) {
  const [text, setText] = useState('$ ');
  const [showCursor, setShowCursor] = useState(true);
  
  const lines = [
    { text: './erulabs.ai --research', delay: 100 },
    { text: '\n    initializing neural pathways........ DONE', delay: 80 },
    { text: '\n    loading research papers................. DONE', delay: 80 },
    { text: '\n    connecting to open source community... DONE', delay: 80 },
    { text: '\n    launching research lab................ ', delay: 80 },
  ];

  useEffect(() => {
    if (skip) {
      setText(lines.map(l => l.text).join('') + 'DONE');
      setTimeout(onComplete, 500);
      return;
    }

    let currentLine = 0;
    let currentChar = 0;
    let currentText = '$ ';

    const typeChar = () => {
      if (currentLine >= lines.length) {
        currentText += 'DONE';
        setText(currentText);
        setTimeout(() => {
          localStorage.setItem('hasSeenIntro', 'true');
          onComplete();
        }, 1000);
        return;
      }

      const line = lines[currentLine];
      if (currentChar < line.text.length) {
        currentText += line.text[currentChar];
        setText(currentText);
        currentChar++;
        setTimeout(typeChar, line.delay);
      } else {
        currentLine++;
        currentChar = 0;
        setTimeout(typeChar, 500);
      }
    };

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    setTimeout(typeChar, 500);

    return () => clearInterval(cursorInterval);
  }, [skip, onComplete]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-green-500 font-mono text-lg whitespace-pre-wrap max-w-2xl">
        <span className="glow-text">{text}</span>
        {showCursor && <span className="cursor" />}
      </div>
      <p className="absolute bottom-8 text-gray-600 text-sm">
        Press Enter to skip
      </p>
    </div>
  );
}