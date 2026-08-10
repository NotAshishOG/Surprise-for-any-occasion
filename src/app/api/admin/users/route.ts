import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { db } from '@/lib/db';

async function checkSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const payload = await verifyAdminToken(token);

  if (!payload) return { authorized: false, payload: null };
  const isSuperAdmin = payload.role === 'SUPER_ADMIN' || payload.role === 'admin' || payload.permissions?.includes('*') || !payload.role;
  return { authorized: isSuperAdmin, payload };
}

// GET /api/admin/users - List all admin users (Super Admin only)
export async function GET() {
  try {
    const { authorized } = await checkSuperAdmin();
    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden. Super Admin access required.' }, { status: 403 });
    }

    const users = await db.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        permissions: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/users - Create a new admin user (Super Admin only)
export async function POST(req: Request) {
  try {
    const { authorized } = await checkSuperAdmin();
    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden. Only Super Admins can create admin accounts.' }, { status: 403 });
    }

    const { username, password, name, role, permissions } = await req.json();

    if (!username || !password || !name) {
      return NextResponse.json({ error: 'Username, password, and name are required.' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const existingUser = await db.adminUser.findUnique({
      where: { username: cleanUsername },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An admin account with this username already exists.' }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    const assignedPermissions = Array.isArray(permissions) ? permissions : [];

    const newUser = await db.adminUser.create({
      data: {
        username: cleanUsername,
        passwordHash,
        name: name.trim(),
        role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'SUB_ADMIN',
        permissions: role === 'SUPER_ADMIN' ? ['*'] : assignedPermissions,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        permissions: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Failed to create admin user.' }, { status: 500 });
  }
}
