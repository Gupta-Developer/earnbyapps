import { verifyToken } from './jwt';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export function getAuthenticatedUser(request: Request): AuthenticatedUser | null {
  try {
    const authHeader = request.headers.get('authorization');
    console.log(`[AUTH HELPER LOG] authHeader: "${authHeader}"`);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[AUTH HELPER LOG] No Bearer token found in Authorization header');
      return null;
    }

    const token = authHeader.substring(7);
    console.log(`[AUTH HELPER LOG] Verifying token: "${token.substring(0, 20)}..."`);
    const decoded = verifyToken(token);
    console.log(`[AUTH HELPER LOG] Decoded token result:`, decoded);
    if (!decoded || !decoded.id || !decoded.email) {
      console.log('[AUTH HELPER LOG] Token decoded but missing id or email');
      return null;
    }

    return {
      id: String(decoded.id),
      email: decoded.email,
      role: decoded.role || 'user',
    };
  } catch (error: any) {
    console.error('[AUTH HELPER LOG] Error in getAuthenticatedUser:', error);
    return null;
  }
}
