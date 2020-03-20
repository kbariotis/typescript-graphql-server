import supertest from "supertest";
import { expect } from "chai";

import { createApp } from "./server";

const request = supertest(createApp().listen());

describe("Server", () => {
  it("should respond for health check", async () => {
    await request
      .get("/healthz")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("GraphQL Server", () => {
  it("should query hello", async () => {
    await request
      .post("/graphql")
      .send({
        query: `
          {
            hello(name: "Kostas")
          }
        `
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        expect(response.body.data.hello).to.eq("Hello Kostas");
      });
  });
});
