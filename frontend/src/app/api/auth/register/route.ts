import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    
    const { password, role, email, project, username } = await request.json();

    if (!password || !email || !project) {
      return NextResponse.json({ message: 'Email, password, and project are required' }, { status: 400 });
    }

    const existing = await User.findOne({ email: email });
    
    if (existing) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      password: hashed, 
      role: role || 'user', 
      email,
      project,
      username: username || email.split('@')[0] // Use email prefix as username if not provided
    });
    
    await newUser.save();

    return NextResponse.json({ message: 'Registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
