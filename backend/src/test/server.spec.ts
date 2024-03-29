
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { server } from "../server";
import request from "supertest";

describe("Server", () => {
  let app: any;

  beforeAll(async () => {
    app = await server;
  });

  afterAll(async () => {
    await app.close();
  });

  it("should start the server", async () => {
    const res = await request(app).get("/meeting/api/v1/ping");
    expect(res.status).toEqual(200);
  });
});
