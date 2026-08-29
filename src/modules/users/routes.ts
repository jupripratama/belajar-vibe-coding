import { Elysia, t } from "elysia";
import { UserService } from "./service";

export const userRoutes = new Elysia({ prefix: "/users" })
  .get("/", async () => {
    return await UserService.getAll();
  }, {
    detail: {
      tags: ["Users"],
      summary: "Get all users",
    },
  })
  .get("/:id", async ({ params: { id }, error }) => {
    const user = await UserService.getById(Number(id));
    if (!user) return error(404, { message: "User not found" });
    return user;
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    detail: {
      tags: ["Users"],
      summary: "Get user by ID",
    },
  })
  .post("/", async ({ body, error }) => {
    try {
      return await UserService.create(body);
    } catch (err: any) {
      return error(400, { message: err.message || "Failed to create user" });
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
    }),
    detail: {
      tags: ["Users"],
      summary: "Create a new user",
    },
  })
  .delete("/:id", async ({ params: { id } }) => {
    return await UserService.delete(Number(id));
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    detail: {
      tags: ["Users"],
      summary: "Delete user by ID",
    },
  });
