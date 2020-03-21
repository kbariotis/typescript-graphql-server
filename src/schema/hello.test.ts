import supertest from "supertest";
import { expect } from "chai";

import { createApp } from "../server";

const request = supertest(createApp().listen());

describe("GraphQL Server", () => {
  it("should query hello", async () => {
    await request
      .post("/graphql")
      .send({
        query: `
          {
            hello(name: "Kostas") {
              name
              greeting
            }
          }
        `
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        expect(response.body.data.hello.name).to.eq("Kostas");
        expect(response.body.data.hello.greeting).to.eq("Hello Kostas");
      });
  });
});
