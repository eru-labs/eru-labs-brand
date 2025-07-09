'use client';

import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';

const publications = [
  {
    title: 'This is Your AI On Peer Pressure: An Observational Study of Inter Agent Social Dynamics',
    authors: ['Eru Labs Research Team'],
    date: '2025',
    abstract: 'We present a novel approach to improving LLM accuracy through multi-agent deliberation, where models engage in structured debate to reach consensus on complex problems.',
    downloads: 569,
    tags: ['Multi-Agent Systems', 'LLMs', 'Ensemble Methods'],
    pdfUrl: '/papers/peer-pressure.pdf',
    featured: true,
  },
];

export default function Publications() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Publications
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our research is open and accessible. All papers are available for download 
            and discussion.
          </p>
        </motion.div>

        <div className="space-y-8">
          {publications.map((pub, index) => (
            <motion.article
              key={pub.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-xl bg-gray-900/50 border ${
                pub.featured ? 'border-green-500/50' : 'border-gray-800'
              } hover:border-gray-700 transition-all duration-300`}
            >
              {pub.featured && (
                <div className="absolute -top-3 -right-3">
                  <span className="px-3 py-1 text-xs font-semibold bg-green-500 text-black rounded-full">
                    Featured
                  </span>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 hover:text-green-500 transition-colors">
                    <Link href={pub.pdfUrl} target="_blank" rel="noopener noreferrer">
                      {pub.title}
                    </Link>
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {pub.date}
                    </span>
                    <span>•</span>
                    <span>{pub.authors.join(', ')}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Download size={14} />
                      {pub.downloads} downloads
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4">{pub.abstract}</p>

                  <div className="flex flex-wrap gap-2">
                    {pub.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href={pub.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors"
                  >
                    <FileText size={18} />
                    Download PDF
                  </Link>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-white rounded-lg hover:border-green-500 hover:text-green-500 transition-colors">
                    <ExternalLink size={18} />
                    Cite Paper
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors"
          >
            View all publications
            <ExternalLink size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}