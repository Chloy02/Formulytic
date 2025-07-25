import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    
    const { email, password, project } = await request.json();

    if (!email || !password || !project) {
      return NextResponse.json({ message: 'Email, password, and project are required' }, { status: 400 });
    }

    // Find user by email and project
    const user = await User.findOne({ 
      email: email,
      project: project
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, project: user.project },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ 
      token, 
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        project: user.project
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
