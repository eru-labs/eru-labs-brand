import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  type?: string; // research inquiry, collaboration, general
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactForm = await request.json();
    const { firstName, lastName, email, phone, country, message, type = 'general' } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('contactForms');

    // Insert contact form
    await collection.insertOne({
      firstName,
      lastName,
      email,
      phone,
      country,
      message,
      type,
      submittedAt: new Date(),
      source: 'research-site',
      status: 'new'
    });

    return NextResponse.json(
      { 
        status: 'success', 
        message: 'Thank you for your interest. We\'ll be in touch soon!' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
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