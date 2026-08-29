import { db } from "../../db";
import { users, type NewUser } from "../../db/schema";
import { eq } from "drizzle-orm";

export const UserService = {
  async getAll() {
    return await db.select().from(users);
  },

  async getById(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  },

  async create(data: NewUser) {
    const [result] = await db.insert(users).values(data);
    return { id: result.insertId, ...data };
  },

  async delete(id: number) {
    await db.delete(users).where(eq(users.id, id));
    return { success: true, message: `User with ID ${id} deleted` };
  },
};
