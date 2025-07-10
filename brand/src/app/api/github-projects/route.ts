// File: app/api/github-projects/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repos = searchParams.get('repos');
  
  if (!repos) {
    return NextResponse.json({ error: 'No repos specified' }, { status: 400 });
  }

  const repoList = repos.split(',');
  
  try {
    // Use GitHub token if available for higher rate limits
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Eru-Labs-Website',
    };
    
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch repos sequentially to avoid rate limiting
    const projects: GitHubRepo[] = [];
    
    for (const repoUrl of repoList) {
      // Extract owner and repo from GitHub URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        console.error(`Invalid GitHub URL: ${repoUrl}`);
        continue; // Skip invalid URLs instead of failing entirely
      }
      
      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, '');

      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
          headers,
          next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${owner}/${cleanRepo}: ${response.status} ${response.statusText}`);
          continue; // Skip failed repos instead of failing entirely
        }

        const repoData: GitHubRepo = await response.json();
        projects.push(repoData);
        
        // Add small delay between requests to be nice to GitHub
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching ${owner}/${cleanRepo}:`, error);
        continue; // Skip errored repos
      }
    }
    
    // Return with cache headers
    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}