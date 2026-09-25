export type UserRole = "ADMIN" | "AGENT" | "COURIER";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Matrice des permissions par rôle
 */
export const ROLE_PERMISSIONS = {
  ADMIN: [
    "order:create",
    "order:read:all",
    "order:update:all",
    "order:delete",
    "order:assign",
    "product:manage",
    "category:manage",
    "courier:manage",
    "user:manage",
    "analytics:view",
  ],
  AGENT: [
    "order:create",
    "order:read:assigned",
    "order:update:status_confirmation", // Can transition: NEW -> CONFIRMED, CANCELLED, NO_ANSWER
  ],
  COURIER: [
    "order:read:assigned",
    "order:update:status_delivery", // Can transition: CONFIRMED/SHIPPED -> DELIVERED, RETURNED
  ],
} as const;

export type Permission =
  | (typeof ROLE_PERMISSIONS)["ADMIN"][number]
  | (typeof ROLE_PERMISSIONS)["AGENT"][number]
  | (typeof ROLE_PERMISSIONS)["COURIER"][number];

/**
 * Vérifie si un rôle possède une permission spécifique
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] as readonly string[];
  return permissions.includes(permission);
}

/**
 * Garde d'autorisation RBAC pour sécuriser l'exécution des Server Actions et Services
 */
export function assertAuthorized(
  user: SessionUser | null | undefined,
  allowedRoles: UserRole[]
): asserts user is SessionUser {
  if (!user) {
    throw new Error("UNAUTHORIZED: Session requise pour effectuer cette opération.");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error(
      `FORBIDDEN: Le rôle '${user.role}' n'a pas les droits nécessaires. Rôles requis: [${allowedRoles.join(", ")}].`
    );
  }
}

/**
 * Workflow de transition de statut d'une commande COD selon le rôle
 */
export function canTransitionStatus(
  role: UserRole,
  fromStatus: string,
  toStatus: string
): boolean {
  if (role === "ADMIN") return true;

  if (role === "AGENT") {
    // Un agent d'appel confirme, relance ou annule les commandes entrantes
    const allowedFrom = ["NEW", "NO_ANSWER"];
    const allowedTo = ["CONFIRMED", "NO_ANSWER", "CANCELLED"];
    return allowedFrom.includes(fromStatus) && allowedTo.includes(toStatus);
  }

  if (role === "COURIER") {
    // Un livreur met à jour la livraison sur le terrain
    const allowedFrom = ["CONFIRMED", "SHIPPED"];
    const allowedTo = ["SHIPPED", "DELIVERED", "RETURNED"];
    return allowedFrom.includes(fromStatus) && allowedTo.includes(toStatus);
  }

  return false;
}
