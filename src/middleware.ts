import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // Protect /vault-cx99 routes (except /vault-cx99/login)
  if (path.startsWith('/vault-cx99') && path !== '/vault-cx99/login') {
    const token = req.cookies.get('admin_token')?.value;
    const payload = await verifyAdminToken(token);

    if (!payload) {
      url.pathname = '/vault-cx99/login';
      return NextResponse.redirect(url);
    }
  }
  
  // Protect /api/admin routes (except /api/admin/login)
  if (path.startsWith('/api/admin') && path !== '/api/admin/login') {
    const token = req.cookies.get('admin_token')?.value;
    const payload = await verifyAdminToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vault-cx99/:path*', '/api/admin/:path*'],
};
