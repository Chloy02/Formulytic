import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    
    const { name, password, role, email } = await request.json();

    // Validation
    const errors: any = {};

    // Name validation
    if (!name || name.trim().length === 0) {
      errors.name = 'Name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    // Email validation
    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format.';
    } else if (!email.toLowerCase().endsWith('@gmail.com')) {
      errors.email = 'Please use a Gmail address (@gmail.com).';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ 
        message: 'Validation failed', 
        errors 
      }, { status: 400 });
    }

    const existing = await User.findOne({ email: email });
    
    if (existing) {
      return NextResponse.json({ 
        message: 'User already exists',
        errors: { email: 'An account with this email already exists.' }
      }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      password: hashed, 
      role: role || 'user', 
      email,
      username: name.trim() // Use the name as username
    });
    
    await newUser.save();

    return NextResponse.json({ message: 'Account created successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ 
      message: 'Server error occurred. Please try again.',
      error: 'Server error' 
    }, { status: 500 });
  }
}
