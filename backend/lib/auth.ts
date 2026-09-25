import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { z } from "zod";

const SALT_ROUNDS = 12;

export const RegisterUserSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères.").max(191),
  email: z.string().email("Adresse email invalide.").toLowerCase(),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères.")
    .max(100),
  role: z.nativeEnum(Role).default(Role.AGENT),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

/**
 * Hachage sécurisé d'un mot de passe avec Salt Rounds élevé
 */
export async function hashPassword(plainText: string): Promise<string> {
  return await bcrypt.hash(plainText, SALT_ROUNDS);
}

/**
 * Vérification d'un mot de passe contre son hash stocké
 */
export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}

/**
 * Service de création d'un utilisateur interne (ADMIN, AGENT, COURIER)
 */
export async function createUser(input: RegisterUserInput) {
  const validated = RegisterUserSchema.parse(input);

  const existingUser = await db.user.findUnique({
    where: { email: validated.email },
  });

  if (existingUser) {
    throw new Error(`Un utilisateur avec l'adresse ${validated.email} existe déjà.`);
  }

  const hashedPassword = await hashPassword(validated.password);

  const user = await db.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: validated.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}
