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

// PATCH /api/admin/users/[id] - Update admin user permissions, status, name, or password
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized } = await checkSuperAdmin();
    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden. Super Admin access required.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, role, permissions, isActive, password } = body;

    const existingUser = await db.adminUser.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: 'Admin user not found.' }, { status: 404 });
    }

    const updateData: Record<string, any> = {};

    if (name !== undefined) updateData.name = name.trim();
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (role !== undefined) {
      updateData.role = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'SUB_ADMIN';
      if (role === 'SUPER_ADMIN') {
        updateData.permissions = ['*'];
      }
    }
    if (permissions !== undefined && updateData.role !== 'SUPER_ADMIN') {
      updateData.permissions = Array.isArray(permissions) ? permissions : [];
    }
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
      }
      updateData.passwordHash = hashPassword(password);
    }

    const updatedUser = await db.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        permissions: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: 'Failed to update admin user.' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete sub-admin user account
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, payload } = await checkSuperAdmin();
    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden. Super Admin access required.' }, { status: 403 });
    }

    const { id } = await params;

    // Prevent super admin from deleting themselves
    if (payload?.id === id) {
      return NextResponse.json({ error: 'You cannot delete your own Super Admin account.' }, { status: 400 });
    }

    const targetUser = await db.adminUser.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: 'Admin user not found.' }, { status: 404 });
    }

    if (targetUser.username === 'admin') {
      return NextResponse.json({ error: 'The primary master admin account cannot be deleted.' }, { status: 400 });
    }

    await db.adminUser.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: 'Failed to delete admin user.' }, { status: 500 });
  }
}
