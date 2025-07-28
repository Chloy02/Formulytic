import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    
    const body = await request.json();
    console.log('Login request body:', body); // Debug logging
    
    const { email, password, project } = body;

    // More specific validation with detailed error messages
    if (!email || !password || !project) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!project) missingFields.push('project');
      
      console.log('Missing fields:', missingFields); // Debug logging
      return NextResponse.json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields 
      }, { status: 400 });
    }

    // Find user by email and project, or by username for admin
    let user;
    if (project === 'admin') {
      // For admin login, try to find by email or username
      user = await User.findOne({ 
        $and: [
          {
            $or: [
              { email: email },
              { username: email } // Allow login with username for admin
            ]
          },
          { role: 'admin' }
        ]
      });
    } else {
      // Regular user login
      user = await User.findOne({ 
        email: email,
        project: project
      });
    }

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
