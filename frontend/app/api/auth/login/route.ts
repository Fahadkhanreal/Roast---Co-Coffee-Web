import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyPassword } from '@/lib/password';
import { generateCSRFToken, verifyCSRFToken } from '@/lib/csrf';
import { createSession, setSessionCookie } from '@/lib/session';

// GET - Generate CSRF token for login form
export async function GET(request: NextRequest) {
  try {
    const csrfToken = generateCSRFToken();
    return NextResponse.json({ csrfToken });
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Login with CSRF and session
export async function POST(request: NextRequest) {
  try {
    const { email, password, csrfToken } = await request.json();

    // Validate input
    if (!email || !password || !csrfToken) {
      return NextResponse.json(
        { error: 'Email, password, and CSRF token are required' },
        { status: 400 }
      );
    }

    // Verify CSRF token
    if (!verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid or expired CSRF token' },
        { status: 403 }
      );
    }

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Query admin user from database
    const { data: adminUser, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !adminUser) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password with bcrypt
    const isValidPassword = await verifyPassword(password, adminUser.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    const sessionId = await createSession(adminUser.id, adminUser.email);

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
      },
      message: 'Login successful'
    });

    // Set secure httpOnly cookie with session
    setSessionCookie(response, sessionId);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
