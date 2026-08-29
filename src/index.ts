import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { usersRoute } from "./routes/users-route";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "Vibe Coding API",
          version: "1.0.0",
          description: "REST API built with Bun, ElysiaJS, Drizzle ORM & MySQL",
        },
      },
    })
  )
  .get("/", () => ({
    message: "Welcome to Vibe Coding API",
    status: "online",
    timestamp: new Date().toISOString(),
  }))
  .use(usersRoute)
  .listen(port);

console.log(
  `🦊 Elysia server is running at http://${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📚 Swagger documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger`
);

export type App = typeof app;
