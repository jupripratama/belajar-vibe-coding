import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const UserService = {
  async registerUser(name: string, email: string, password: string): Promise<string> {
    // 1. Cek apakah email sudah ada di database
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // 2. Jika email sudah ada -> throw error
    if (existingUser.length > 0) {
      throw new Error("email sudah terdaftar");
    }

    // 3. Jika email belum ada -> hash password menggunakan Bun.password
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // 4. Insert data user baru ke database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Return "OK"
    return "OK";
  },

  async loginUser(email: string, password: string): Promise<string> {
    // 1. Cari user berdasarkan email
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // 2. Jika user tidak ditemukan
    if (result.length === 0) {
      throw new Error("email atau password salah");
    }

    const user = result[0];

    // 3. Verifikasi password menggunakan Bun.password.verify
    const isPasswordValid = await Bun.password.verify(password, user.password);

    // 4. Jika password tidak cocok
    if (!isPasswordValid) {
      throw new Error("email atau password salah");
    }

    // 5. Generate token UUID
    const token = uuidv4();

    // 6. Simpan session ke database
    await db.insert(sessions).values({
      token,
      userId: user.id,
    });

    // 7. Return token
    return token;
  },
};
