import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.ADMIN_API_TOKEN || 'Chatmi#Admin2026!SecureKey99';
const encodedKey = new TextEncoder().encode(secretKey);

export interface AdminJwtPayload {
  id: string;
  username: string;
  name: string;
  role: 'SUPER_ADMIN' | 'SUB_ADMIN' | 'admin';
  permissions: string[];
}

export async function signAdminToken(payload: AdminJwtPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(encodedKey);
}

export async function verifyAdminToken(token: string | undefined): Promise<AdminJwtPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as AdminJwtPayload;
  } catch (error) {
    return null;
  }
}

export function hasPermission(permissions: string[] | undefined, requiredPermission: string): boolean {
  if (!permissions) return false;
  if (permissions.includes('*')) return true;
  return permissions.includes(requiredPermission);
}


