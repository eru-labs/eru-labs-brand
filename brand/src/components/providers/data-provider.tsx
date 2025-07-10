// File: src/components/providers/data-provider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadConfig, type SiteConfig } from '@/lib/config';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  clone_url: string;
  homepage?: string;
}

interface ZenodoRecord {
  id: string;
  metadata: {
    title: string;
    creators: Array<{ name: string }>;
    publication_date: string;
    description: string;
    keywords?: string[];
    doi: string;
    resource_type: {
      title: string;
      type: string;
    };
  };
  stats: {
    downloads: number;
    views: number;
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
    size: number;
  }>;
}

interface DataContextType {
  // Configuration
  config: SiteConfig | null;
  
  // GitHub data
  githubRepos: GitHubRepo[];
  githubStats: {
    stars: number;
    forks: number;
    projectCount: number;
  };
  
  // Zenodo data
  zenodoRecords: ZenodoRecord[];
  zenodoStats: {
    downloads: number;
    views: number;
  };
  
  // Loading states
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  
  // Utilities
  refetch: () => void;
  getGitHubRepoByUrl: (url: string) => GitHubRepo | undefined;
  getZenodoRecordById: (id: string) => ZenodoRecord | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const CACHE_KEY = 'eru-labs-data-provider-v2';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function DataProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [zenodoRecords, setZenodoRecords] = useState<ZenodoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  const fetchGitHubRepos = async (urls: string[]): Promise<GitHubRepo[]> => {
    const repoUrls = urls.join(',');
    const response = await fetch(`/api/github-projects?repos=${encodeURIComponent(repoUrls)}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || `API error: ${response.statusText}`);
    }

    return response.json();
  };

  const fetchZenodoRecord = async (id: string): Promise<ZenodoRecord> => {
    const response = await fetch(`/api/zenodo?id=${id}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || `Zenodo API error: ${response.statusText}`);
    }

    return response.json();
  };

  const loadFromCache = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return false;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return false;
      }

      console.log('DataProvider: Loading from cache');
      setGithubRepos(data.githubRepos || []);
      setZenodoRecords(data.zenodoRecords || []);
      setLastFetch(timestamp);
      return true;
    } catch (err) {
      console.warn('DataProvider: Failed to load from cache:', err);
      localStorage.removeItem(CACHE_KEY);
      return false;
    }
  };

  const saveToCache = (githubData: GitHubRepo[], zenodoData: ZenodoRecord[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      const now = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: {
          githubRepos: githubData,
          zenodoRecords: zenodoData,
        },
        timestamp: now,
      }));
    } catch (err) {
      console.warn('Failed to cache data:', err);
    }
  };

  const fetchData = async (forceFresh = false) => {
    if (!config) {
      console.log('DataProvider: Config not loaded yet, skipping fetch');
      return;
    }

    if (!forceFresh && loadFromCache()) {
      setLoading(false);
      return;
    }

    console.log('DataProvider: Starting fetch with config:', { 
      githubRepos: config.github.repositories, 
      zenodoRecords: config.zenodo.recordIds 
    });
    setLoading(true);
    setError(null);

    try {
      // Fetch GitHub repos
      console.log('DataProvider: Fetching GitHub repos...');
      const githubPromise = fetchGitHubRepos(config.github.repositories);
      
      // Fetch Zenodo records with better error handling
      console.log('DataProvider: Fetching Zenodo records...');
      const zenodoResults = [];
      
      for (const id of config.zenodo.recordIds) {
        try {
          console.log('DataProvider: Fetching Zenodo record:', id);
          const record = await fetchZenodoRecord(id);
          zenodoResults.push(record);
        } catch (error) {
          console.error('DataProvider: Failed to fetch Zenodo record:', id, error);
          // Continue with other records even if one fails
        }
      }

      console.log('DataProvider: Waiting for GitHub data...');
      const githubData = await githubPromise;
      
      console.log('DataProvider: Received data:', {
        githubRepos: githubData.length,
        zenodoRecords: zenodoResults.length,
        zenodoData: zenodoResults
      });

      setGithubRepos(githubData);
      setZenodoRecords(zenodoResults);
      
      const now = Date.now();
      setLastFetch(now);
      
      saveToCache(githubData, zenodoResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('DataProvider: Error fetching data:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load configuration on mount
  useEffect(() => {
    const initializeConfig = async () => {
      try {
        console.log('DataProvider: Loading configuration...');
        const loadedConfig = await loadConfig();
        console.log('DataProvider: Configuration loaded:', loadedConfig);
        setConfig(loadedConfig);
      } catch (err) {
        console.error('DataProvider: Failed to load configuration:', err);
        setError('Failed to load configuration');
        setLoading(false);
      }
    };

    initializeConfig();
  }, []);

  // Fetch data when config is loaded
  useEffect(() => {
    if (config) {
      fetchData();
    }
  }, [config]);

  const githubStats = {
    stars: githubRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
    forks: githubRepos.reduce((acc, repo) => acc + repo.forks_count, 0),
    projectCount: githubRepos.length,
  };

  const zenodoStats = {
    downloads: zenodoRecords.reduce((acc, record) => acc + record.stats.downloads, 0),
    views: zenodoRecords.reduce((acc, record) => acc + record.stats.views, 0),
  };

  const getGitHubRepoByUrl = (url: string): GitHubRepo | undefined => {
    return githubRepos.find(repo => repo.html_url === url || repo.clone_url === url);
  };

  const getZenodoRecordById = (id: string): ZenodoRecord | undefined => {
    console.log('🔍 getZenodoRecordById - Looking for ID:', id, 'Type:', typeof id);
    console.log('🔍 Available records:', zenodoRecords.map(r => ({ 
      id: r.id, 
      type: typeof r.id, 
      title: r.metadata?.title 
    })));
    
    const found = zenodoRecords.find(record => {
      // Try multiple matching strategies to handle different data types
      const strategies = [
        () => record.id === id,                           // Exact match
        () => record.id == id,                            // Loose equality  
        () => String(record.id) === String(id),           // String conversion
        () => String(record.id).trim() === String(id).trim(), // Trimmed strings
        () => parseInt(record.id) === parseInt(id),       // Number conversion
        () => record.id.toString() === id.toString()      // Explicit toString
      ];
      
      for (let i = 0; i < strategies.length; i++) {
        try {
          if (strategies[i]()) {
            console.log(`✅ Match found using strategy ${i + 1}:`, record.metadata?.title);
            return true;
          }
        } catch (e) {
          // Strategy failed, try next one
          continue;
        }
      }
      
      return false;
    });
    
    if (!found) {
      console.log('❌ No record found for ID:', id);
      console.log('🔍 Raw comparison details:');
      zenodoRecords.forEach((record, index) => {
        console.log(`  Record ${index}: "${record.id}" (${typeof record.id}) vs "${id}" (${typeof id})`);
        console.log(`    Exact match: ${record.id === id}`);
        console.log(`    String match: ${String(record.id) === String(id)}`);
      });
    }
    
    return found;
  };

  const refetch = () => {
    fetchData(true);
  };

  const value: DataContextType = {
    config,
    githubRepos,
    githubStats,
    zenodoRecords,
    zenodoStats,
    loading,
    error,
    lastFetch,
    refetch,
    getGitHubRepoByUrl,
    getZenodoRecordById,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useERULabsData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useERULabsData must be used within a DataProvider');
  }
  return context;
}