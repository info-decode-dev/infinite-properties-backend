import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../config/database";

export interface IUser extends User {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const UserModel = {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async create(data: { email: string; password: string; name?: string; role?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || "admin",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async comparePassword(user: User, candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, user.password);
  },
};
