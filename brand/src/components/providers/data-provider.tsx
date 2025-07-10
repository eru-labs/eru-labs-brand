// File: src/components/providers/data-provider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Centralized configuration of all GitHub repos and Zenodo records
const GITHUB_REPOS = [
  'https://github.com/im-knots/ea-monorepo',
  'https://github.com/im-knots/the-academy',
  'https://github.com/im-knots/gvft',
];

const ZENODO_RECORD_IDS = [
  '15724141',
];

const CACHE_KEY = 'eru-labs-data-provider-v1';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function DataProvider({ children }: { children: ReactNode }) {
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
    const apiUrl = `https://zenodo.org/api/records/${id}`;
    console.log('Fetching Zenodo record from:', apiUrl);
    
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Zenodo API response status:', response.status, response.statusText);
      
      if (!response.ok) {
        // Try alternative API endpoint
        const altApiUrl = `https://zenodo.org/api/records/${id}?access_token=`;
        console.log('Trying alternative endpoint:', altApiUrl);
        
        const altResponse = await fetch(altApiUrl);
        if (!altResponse.ok) {
          throw new Error(`Zenodo API error: ${response.status} ${response.statusText} for record ${id}`);
        }
        const altData = await altResponse.json();
        console.log('Successfully fetched Zenodo record from alt endpoint:', altData.metadata?.title);
        return altData;
      }
      
      const data = await response.json();
      console.log('Successfully fetched Zenodo record:', data.metadata?.title);
      return data;
    } catch (error) {
      console.error('Failed to fetch Zenodo record:', id, error);
      throw error;
    }
  };

  const loadFromCache = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        if (now - timestamp < CACHE_DURATION) {
          setGithubRepos(data.githubRepos || []);
          setZenodoRecords(data.zenodoRecords || []);
          setLastFetch(timestamp);
          setLoading(false);
          return true;
        }
      }
    } catch (err) {
      console.warn('Failed to load cache:', err);
    }
    
    return false;
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
    if (!forceFresh && loadFromCache()) {
      return;
    }

    console.log('DataProvider: Starting fetch with configs:', { GITHUB_REPOS, ZENODO_RECORD_IDS });
    setLoading(true);
    setError(null);

    try {
      // Fetch GitHub repos
      console.log('DataProvider: Fetching GitHub repos...');
      const githubPromise = fetchGitHubRepos(GITHUB_REPOS);
      
      // Fetch Zenodo records with better error handling
      console.log('DataProvider: Fetching Zenodo records...');
      const zenodoResults = [];
      
      for (const id of ZENODO_RECORD_IDS) {
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      console.error('DataProvider: Error fetching data:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate aggregate stats
  const githubStats = {
    stars: githubRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
    forks: githubRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
    projectCount: githubRepos.length,
  };

  const zenodoStats = {
    downloads: zenodoRecords.reduce((sum, record) => sum + (record.stats?.downloads || 0), 0),
    views: zenodoRecords.reduce((sum, record) => sum + (record.stats?.views || 0), 0),
  };

  // Utility functions
  const getGitHubRepoByUrl = (url: string): GitHubRepo | undefined => {
    return githubRepos.find(repo => 
      url.includes(repo.full_name) || 
      repo.html_url.includes(url.split('/').slice(-2).join('/'))
    );
  };

  const getZenodoRecordById = (id: string): ZenodoRecord | undefined => {
    console.log('Looking for Zenodo record with ID:', id, 'Type:', typeof id);
    console.log('Available records count:', zenodoRecords.length);
    zenodoRecords.forEach((record, index) => {
      console.log(`Record ${index}:`, {
        id: record.id,
        type: typeof record.id,
        length: record.id.length,
        title: record.metadata?.title,
        strictEqual: record.id === id,
        looseEqual: record.id == id
      });
    });
    
    const found = zenodoRecords.find(record => {
      const match = record.id === id || record.id === parseInt(id).toString() || record.id.toString() === id;
      console.log(`Comparing "${record.id}" === "${id}": ${match}`);
      return match;
    });
    
    console.log('Found record:', found ? found.metadata.title : 'NOT FOUND');
    return found;
  };

  const value: DataContextType = {
    githubRepos,
    githubStats,
    zenodoRecords,
    zenodoStats,
    loading,
    error,
    lastFetch,
    refetch: () => fetchData(true),
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