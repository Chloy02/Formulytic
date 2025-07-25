import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For now, return hardcoded projects
    // TODO: Replace with actual database query when projects table is implemented
    const projects = [
      { id: 'project1', name: 'Project 1', description: 'First project' },
      { id: 'project2', name: 'Project 2', description: 'Second project' }
    ];

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
