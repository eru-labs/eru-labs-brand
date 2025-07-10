// File: src/app/page.tsx
'use client';

import { motion } from 'framer-motion';
import Hero from '@/components/sections/hero';
import ResearchAreas from '@/components/sections/research-areas';
import Publications from '@/components/sections/publications';
import TeamSection from '@/components/sections/team-section';
import OpenSourceProjects from '@/components/sections/open-source-projects';
import MissionSection from '@/components/sections/mission';

export default function HomePage() {
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
      <MissionSection />
    </motion.div>
  );
}
