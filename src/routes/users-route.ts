import { Elysia, t } from "elysia";
import { UserService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/users" })
  .post("/", async ({ body, set }) => {
    try {
      const result = await UserService.registerUser(body.name, body.email, body.password);
      set.status = 201;
      return { data: result };
    } catch (err: any) {
      set.status = 400;
      return { error: err.message || "Failed to register user" };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
    }),
    detail: {
      tags: ["Users"],
      summary: "Register a new user",
    },
  })
  .post("/login", async ({ body, set }) => {
    try {
      const token = await UserService.loginUser(body.email, body.password);
      set.status = 200;
      return { data: token };
    } catch (err: any) {
      set.status = 400;
      return { error: err.message || "email atau password salah" };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
    detail: {
      tags: ["Users"],
      summary: "Login user",
    },
  })
  .get("/current", async ({ headers, set }) => {
    try {
      const authHeader = headers["authorization"];
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : authHeader?.trim();

      if (!token) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const user = await UserService.getCurrentUser(token);
      set.status = 200;
      return user;
    } catch (err: any) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  }, {
    detail: {
      tags: ["Users"],
      summary: "Get current logged-in user",
      security: [{ BearerAuth: [] }],
    },
  });
