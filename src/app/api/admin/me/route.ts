import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    const payload = await verifyAdminToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: payload.id || 'super-admin-id',
        username: payload.username || 'admin',
        name: payload.name || 'Super Admin',
        role: payload.role || 'SUPER_ADMIN',
        permissions: payload.permissions || ['*'],
      },
    });
  } catch (error) {
    console.error('Admin Me Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
