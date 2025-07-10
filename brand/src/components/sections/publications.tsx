'use client';

import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Define your Zenodo record IDs here
const ZENODO_IDS = [
  '15724141',
];

interface ZenodoRecord {
  id: string;
  metadata: {
    title: string;
    creators: Array<{ name: string }>;
    publication_date: string;
    description: string;
    keywords?: string[];
    doi: string;
  };
  stats: {
    downloads: number;
  };
  links: {
    self_html: string;
    files?: string;
  };
  files?: Array<{
    key: string;
    links: {
      self: string;
    };
    type: string;
  }>;
}

interface Publication {
  id: string;
  title: string;
  authors: string[];
  date: string;
  abstract: string;
  downloads: number;
  tags: string[];
  zenodoUrl: string;
  pdfUrl: string;
  doi: string;
  featured?: boolean;
}

export default function Publications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const promises = ZENODO_IDS.map(async (id) => {
          const response = await fetch(`https://zenodo.org/api/records/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch record ${id}: ${response.statusText}`);
          }
          return response.json() as Promise<ZenodoRecord>;
        });

        const zenodoRecords = await Promise.all(promises);
        
        const transformedPublications: Publication[] = zenodoRecords.map((record, index) => {
          // Find PDF file
          const pdfFile = record.files?.find(file => 
            file.type === 'pdf' || file.key.toLowerCase().includes('.pdf')
          );
          
          return {
            id: record.id,
            title: record.metadata.title,
            authors: record.metadata.creators.map(creator => creator.name),
            date: new Date(record.metadata.publication_date).getFullYear().toString(),
            abstract: record.metadata.description.replace(/<[^>]*>/g, '').substring(0, 300) + '...',
            downloads: record.stats.downloads,
            tags: record.metadata.keywords || [],
            zenodoUrl: record.links.self_html,
            pdfUrl: pdfFile ? pdfFile.links.self : record.links.self_html,
            doi: record.metadata.doi,
            featured: index === 0, // Mark first publication as featured
          };
        });

        setPublications(transformedPublications);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch publications');
        console.error('Error fetching publications:', err);
      } finally {
        setLoading(false);
      }
    };

    if (ZENODO_IDS.length > 0) {
      fetchPublications();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <section id="publications" className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 text-xl text-gray-400"
            >
              <Loader2 className="animate-spin" size={24} />
              Loading publications...
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="publications" className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="text-red-400 text-lg">
              Error loading publications: {error}
            </div>
            <p className="text-gray-500 mt-2">
              Please check the Zenodo IDs and try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="publications" className="py-20 bg-gray-950">
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

        {publications.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>No publications found. Please add Zenodo IDs to display publications.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {publications.map((pub, index) => (
              <motion.article
                key={pub.id}
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
                      <Link href={pub.zenodoUrl} target="_blank" rel="noopener noreferrer">
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
                      <span>•</span>
                      <span className="text-green-400">DOI: {pub.doi}</span>
                    </div>

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
                    <Link
                      href={pub.zenodoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-white rounded-lg hover:border-green-500 hover:text-green-500 transition-colors"
                    >
                      <ExternalLink size={18} />
                      View on Zenodo
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

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