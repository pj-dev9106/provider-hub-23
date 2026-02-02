import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ROLES, type Role } from "@/lib/roles";

const AUTH_STORAGE_KEY = "provider-portal-auth";
const ACTIVE_ROLE_KEY = "provider-portal-active-role";

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  /** All roles assigned to this user (e.g. Provider + Corporate Admin for dual-role). */
  roles: Role[];
}

interface AuthState {
  user: AuthUser | null;
  /** Role the user is currently "acting as" for nav and permissions. */
  activeRole: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  signInWithMicrosoft: (roleOrRoles?: Role | Role[]) => Promise<void>;
  setActiveRole: (role: Role) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_BASES: Record<string, { id: string; displayName: string; email: string; avatar?: string }> = {
  provider: {
    id: "entra-mock-provider-1",
    displayName: "Sarah Johnson",
    email: "sarah.johnson@healthcare.org",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
  },
  coordinator: {
    id: "entra-mock-coordinator-1",
    displayName: "Maria Garcia",
    email: "maria.garcia@healthcare.org",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face",
  },
  corporateAdmin: {
    id: "entra-mock-admin-1",
    displayName: "James Chen",
    email: "james.chen@healthcare.org",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  corporateClinician: {
    id: "entra-mock-corp-clinician-1",
    displayName: "Alex Rivera",
    email: "alex.rivera@healthcare.org",
    avatar: "https://images.unsplash.com/photo-1612349316228-5942a9b489c2?w=100&h=100&fit=crop&crop=face",
  },
  corporateContributor: {
    id: "entra-mock-corp-contrib-1",
    displayName: "Jordan Lee",
    email: "jordan.lee@healthcare.org",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
  },
  dualRole: {
    id: "entra-mock-dual-1",
    displayName: "Sam Taylor",
    email: "sam.taylor@healthcare.org",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
};

const ROLE_TO_MOCK_KEY: Record<Role, string> = {
  [ROLES.Provider]: "provider",
  [ROLES.Coordinator]: "coordinator",
  [ROLES.CorporateAdmin]: "corporateAdmin",
  [ROLES.CorporateClinician]: "corporateClinician",
  [ROLES.CorporateContributor]: "corporateContributor",
};

/** Mock Microsoft Entra ID (Azure AD) sign-in. roleOrRoles: single role or array for dual-role user. */
async function mockEntraSignIn(roleOrRoles: Role | Role[]): Promise<AuthUser> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  const key = roles.length > 1 ? "dualRole" : ROLE_TO_MOCK_KEY[roles[0]];
  const base = MOCK_BASES[key];
  return { ...base, roles };
}

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser & { role?: Role };
    // Migrate old single role to roles array
    if (!parsed.roles) {
      parsed.roles = parsed.role ? [parsed.role] : [ROLES.Provider];
    }
    delete (parsed as AuthUser & { role?: Role }).role;
    return parsed as AuthUser;
  } catch {
    return null;
  }
}

function loadActiveRole(user: AuthUser | null): Role | null {
  if (!user || user.roles.length === 0) return null;
  try {
    const stored = localStorage.getItem(ACTIVE_ROLE_KEY);
    if (stored && user.roles.includes(stored as Role)) return stored as Role;
  } catch {
    /* ignore */
  }
  return user.roles[0];
}

function saveActiveRole(role: Role) {
  try {
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
  } catch {
    /* ignore */
  }
}

function saveUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser());
  const [activeRole, setActiveRoleState] = useState<Role | null>(() =>
    loadActiveRole(loadStoredUser()),
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const u = loadStoredUser();
    setUser(u);
    setActiveRoleState((prev) => loadActiveRole(u) ?? prev);
  }, []);

  const setActiveRole = useCallback((role: Role) => {
    setActiveRoleState(role);
    saveActiveRole(role);
  }, []);

  useEffect(() => {
    if (user && activeRole && !user.roles.includes(activeRole)) {
      const next = user.roles[0];
      setActiveRoleState(next);
      saveActiveRole(next);
    }
  }, [user, activeRole]);

  const signInWithMicrosoft = useCallback(async (roleOrRoles?: Role | Role[]) => {
    setIsLoading(true);
    try {
      const effective = roleOrRoles ?? ROLES.Provider;
      const roles = Array.isArray(effective) ? effective : [effective];
      const authUser = await mockEntraSignIn(roles);
      setUser(authUser);
      saveUser(authUser);
      const nextActive = loadActiveRole(authUser);
      setActiveRoleState(nextActive);
      if (nextActive) saveActiveRole(nextActive);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setActiveRoleState(null);
    saveUser(null);
    try {
      localStorage.removeItem(ACTIVE_ROLE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      activeRole: user && activeRole ? activeRole : null,
      isAuthenticated: !!user,
      isLoading,
      signInWithMicrosoft,
      setActiveRole,
      signOut,
    }),
    [user, activeRole, isLoading, signInWithMicrosoft, setActiveRole, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
