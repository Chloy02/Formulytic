import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    
    const { password, role, email, project } = await request.json();

    console.log('Registration request data:', { email, project, role, hasPassword: !!password });

    if (!password || !email || !project) {
      return NextResponse.json({ message: 'Email, password, and project are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    
    if (existingUser) {
      return NextResponse.json({ message: 'A user with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user object with only the fields we need
    const userData = { 
      email,
      password: hashedPassword, 
      role: role || 'user', 
      project
    };
    
    console.log('Creating user with data:', { email, project, role });
    
    const newUser = new User(userData);
    await newUser.save();

    console.log('User created successfully:', email);
    return NextResponse.json({ message: 'Registered successfully' }, { status: 201 });
  } catch (error: unknown) {
    const errorObj = error as {
      message: string;
      code?: number;
      name?: string;
      keyValue?: Record<string, string>;
      stack?: string;
    };
    
    console.error('Register error details:', {
      message: errorObj.message,
      code: errorObj.code,
      name: errorObj.name,
      keyValue: errorObj.keyValue,
      stack: errorObj.stack
    });
    
    // Handle duplicate key errors more specifically
    if (errorObj.code === 11000) {
      const duplicateField = Object.keys(errorObj.keyValue || {})[0] || 'field';
      const message = duplicateField === 'email' 
        ? 'A user with this email already exists'
        : `A user with this ${duplicateField} already exists`;
      return NextResponse.json({ message }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: 'Registration failed. Please try again.',
      error: errorObj.message 
    }, { status: 500 });
  }
}
