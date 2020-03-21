import supertest from "supertest";

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
