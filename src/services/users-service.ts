import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const UserService = {
  async registerUser(name: string, email: string, password: string): Promise<string> {
    // 1. Cek apakah email sudah ada di database
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // 2. Jika email sudah ada -> throw error
    if (existingUser.length > 0) {
      throw new Error("email sudah terdaftar");
    }

    // 3. Jika email belum ada -> hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert data user baru ke database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Return "OK"
    return "OK";
  },
};
