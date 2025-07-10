// File: src/app/api/zenodo/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'No Zenodo record ID specified' }, { status: 400 });
  }

  try {
    console.log(`Fetching Zenodo record: ${id}`);
    
    // First try the main Zenodo API
    const apiUrl = `https://zenodo.org/api/records/${id}`;
    console.log('Zenodo API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Eru-Labs-Website',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    console.log('Zenodo API response status:', response.status, response.statusText);
    
    if (!response.ok) {
      // If the main API fails, provide detailed error info
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Zenodo API error for record ${id}:`, response.status, response.statusText, errorText);
      
      return NextResponse.json(
        { 
          error: 'Zenodo record not found or not accessible',
          details: `Record ID ${id}: ${response.status} ${response.statusText}`,
          suggestion: 'Please verify the Zenodo record ID is correct and the record is publicly accessible'
        },
        { status: response.status }
      );
    }

    const data: ZenodoRecord = await response.json();
    console.log('Successfully fetched Zenodo record:', data.metadata?.title);
    
    // Return with cache headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching Zenodo record:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Zenodo record',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        recordId: id
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