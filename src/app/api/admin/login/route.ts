import { NextResponse } from 'next/server';
import { signAdminToken, AdminJwtPayload } from '@/lib/auth';
import { hashPassword, comparePassword } from '@/lib/password';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const hardcodedToken = 'Chatmi#Admin2026!SecureKey99';
    const envToken = process.env.ADMIN_API_TOKEN;
    const isMasterPassword = password === hardcodedToken || (!!envToken && password === envToken);

    let userPayload: AdminJwtPayload | null = null;

    // Check database for matching user if username is provided
    if (username && username.trim() !== '') {
      const dbUser = await db.adminUser.findUnique({
        where: { username: username.trim().toLowerCase() },
      });

      if (dbUser) {
        if (!dbUser.isActive) {
          return NextResponse.json({ error: 'This admin account has been deactivated.' }, { status: 403 });
        }

        const isValidPass = comparePassword(password, dbUser.passwordHash) || isMasterPassword;
        if (!isValidPass) {
          return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        userPayload = {
          id: dbUser.id,
          username: dbUser.username,
          name: dbUser.name,
          role: dbUser.role as 'SUPER_ADMIN' | 'SUB_ADMIN',
          permissions: dbUser.permissions,
        };
      }
    }

    // Master Super Admin login (if no user in DB or logging in as master admin)
    if (!userPayload && isMasterPassword) {
      // Find or seed master admin in DB
      let masterUser = await db.adminUser.findUnique({
        where: { username: 'admin' },
      });

      if (!masterUser) {
        masterUser = await db.adminUser.create({
          data: {
            username: 'admin',
            passwordHash: hashPassword(hardcodedToken),
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            permissions: ['*'],
            isActive: true,
          },
        });
      }

      userPayload = {
        id: masterUser.id,
        username: masterUser.username,
        name: masterUser.name,
        role: masterUser.role as 'SUPER_ADMIN' | 'SUB_ADMIN',
        permissions: masterUser.permissions,
      };
    }

    if (!userPayload) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signAdminToken(userPayload);
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ success: true, user: userPayload });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

