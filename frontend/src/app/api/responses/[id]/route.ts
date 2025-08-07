import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://formulytic-production.up.railway.app/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authorization header
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization) {
      return NextResponse.json({ message: 'No authorization token provided' }, { status: 401 });
    }

    const { id } = params;

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/responses/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching response:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authorization header
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization) {
      return NextResponse.json({ message: 'No authorization token provided' }, { status: 401 });
    }

    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ message: 'Response ID is required' }, { status: 400 });
    }

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/responses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authorization,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting response:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
