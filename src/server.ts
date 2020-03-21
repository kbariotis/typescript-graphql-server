import Koa from "koa";
import KoaRouter from "koa-router";
import { ApolloServer, gql } from "apollo-server-koa";
import { readdirSync, readFileSync } from "fs";
import { join as pathJoin } from "path";

async function main() {
  const app = createApp();
  const port = process.env.PORT || 3100;

  app.listen(port);

  console.log(`Listening on port ${port}`);
}

export function createApp(): Koa {
  const app = new Koa();

  const router = new KoaRouter();

  // Fetch all schema definition files
  const schemaFiles = readdirSync(pathJoin(__dirname, "schema")).filter(
    file => file.indexOf(".graphql") > 0
  );

  // Concatanate them to create our schema
  const schema = schemaFiles
    .map(file => readFileSync(pathJoin(__dirname, `schema/${file}`)).toString())
    .join();

  // Based on these files, bring their respective query resolvers
  const queryResolvers = schemaFiles
    .map(file => file.replace(".graphql", ""))
    .map(file => require(pathJoin(__dirname, `queries/${file}`)).default)
    .reduce(
      (initial, current) => ({
        ...initial,
        ...current.Query
      }),
      {}
    );

  const server = new ApolloServer({
    typeDefs: gql(`
      type Query

      schema {
        query: Query
      }

      ${schema}
    `),
    resolvers: {
      Query: queryResolvers
    },
    formatError: errorHandler
  });

  router.get("/healthz", ctxt => {
    ctxt.body = { success: true };
  });

  router.post("/graphql", server.getMiddleware());
  router.get("/graphql", server.getMiddleware());

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

const errorHandler = (err: Error) => {
  console.log("Error while running resolver", {
    error: err
  });

  // Hide all internals by default
  // Change that when we introduce custom error instances
  return new Error("Internal server error");
};

if (require.main === module) {
  main();
}
