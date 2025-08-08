import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({ message: 'No token, access denied' }, { status: 401 });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    let user;
    // Handle hardcoded admin ID case
    if (decoded.id === 'admin_hardcoded') {
      user = await User.findOne({ 
        role: 'admin',
        $or: [
          { email: 'admin@formulytic.com' },
          { username: 'admin' }
        ]
      }).select('-password');
    } else {
      user = await User.findById(decoded.id).select('-password');
    }
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('GetMe error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
