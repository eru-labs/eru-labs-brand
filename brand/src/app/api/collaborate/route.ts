import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

interface CollaborationRequest {
  firstName: string;
  lastName: string;
  email: string;
  organization?: string;
  role?: string;
  researchArea: string;
  proposal: string;
  github?: string;
  website?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CollaborationRequest = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      organization, 
      role,
      researchArea, 
      proposal,
      github,
      website 
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !researchArea || !proposal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('collaborations');

    // Insert collaboration request
    await collection.insertOne({
      firstName,
      lastName,
      email,
      organization,
      role,
      researchArea,
      proposal,
      github,
      website,
      submittedAt: new Date(),
      status: 'pending',
      source: 'research-site'
    });

    return NextResponse.json(
      { 
        status: 'success', 
        message: 'Thank you for your collaboration proposal. Our research team will review and get back to you.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Collaboration request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit collaboration request' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}