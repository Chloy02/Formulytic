import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Projects API called'); // Debug logging
    
    // For now, return hardcoded projects
    // TODO: Replace with actual database query when projects table is implemented
    const projects = [
      { id: 'project1', name: 'Project 1', description: 'First project' },
      { id: 'project2', name: 'Project 2', description: 'Second project' },
      { id: 'admin', name: 'Admin Project', description: 'Administrative project' }
    ];

    console.log('Returning projects:', projects); // Debug logging

    return NextResponse.json({ 
      projects,
      success: true,
      message: 'Projects fetched successfully' 
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch projects',
      success: false,
      projects: [] // Return empty array as fallback
    }, { status: 500 });
  }
}
