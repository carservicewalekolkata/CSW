/**
 * Central list for guarded customer routes.
 * Add paths (e.g. '/profile') when authentication gating is ready.
 */
export const protectedRoutes: string[] = [];

export const isRouteProtected = (pathname: string) =>
  protectedRoutes.some((route) => route === pathname);
