import request from "supertest";
import { app } from "../../app";

describe("Signup route", () => {
  it("not return 404", async () => {
    const response = await request(app).post("/api/v1/users/signup").send({
      email: "test@test.com",
      password: "password",
    });

    expect(response.status).not.toEqual(404);
  });

  it("returns 400 with an invalid email", async () => {
    await request(app)
      .post("/api/v1/users/signup")
      .send({ email: "abcdabcdabcd", password: "12345678" })
      .expect(400);
  });

  it("returns 400 with an invalid password", async () => {
    await request(app)
      .post("/api/v1/users/signup")
      .send({ email: "test@gmail.com", password: "12" })
      .expect(400);
  });

  it("cannot use same email", async () => {
    await request(app)
      .post("/api/v1/users/signup")
      .send({ email: "test@gmail.com", password: "12345678" })
      .expect(201);

    await request(app)
      .post("/api/v1/users/signup")
      .send({ email: "test@gmail.com", password: "12345678" })
      .expect(400);
  });

  it("return cookie when successfully signed up", async () => {
    const response = await request(app)
      .post("/api/v1/users/signup")
      .send({ email: "test@gmail.com", password: "12345678" });

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("Signin route", () => {
  it("not return 404", async () => {
    const response = await request(app).post("/api/v1/users/signin").send({
      email: "test@test.com",
      password: "password",
    });

    expect(response.status).not.toEqual(404);
  });

  it("returns 400 with an invalid email", async () => {
    await request(app)
      .post("/api/v1/users/signin")
      .send({ email: "abcdabcdabcd", password: "12345678" })
      .expect(400);
  });

  it("returns 400 with an invalid password", async () => {
    await request(app)
      .post("/api/v1/users/signin")
      .send({ email: "test@gmail.com" })
      .expect(400);
  });

  it("return cookie when successfully signed in", async () => {
    await request(app)
      .post("/api/v1/users/signup")
      .send({ email: "test@gmail.com", password: "12345678" });

    const response = await request(app)
      .post("/api/v1/users/signin")
      .send({ email: "test@gmail.com", password: "12345678" });

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("Signout route", () => {
  it("not return 404", async () => {
    const response = await request(app).post("/api/v1/users/signout").send({});

    expect(response.status).not.toEqual(404);
  });

  it("clears the cookie after signing out", async () => {
    await request(app)
      .post("/api/v1/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    const response = await request(app)
      .post("/api/v1/users/signout")
      .send({})
      .expect(200);

    expect(response.get("Set-Cookie")[0]).toEqual(
      "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});

describe("Current user route", () => {
  it("not return 404", async () => {
    const response = await request(app).get("/api/v1/users/currentuser");

    expect(response.status).not.toEqual(404);
  });

  it("responds with details of signed in user", async () => {
    const cookie = await global.signin();

    const response = await request(app)
      .get("/api/v1/users/currentuser")
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");
  });

  it("responds with null if user is not signed in", async () => {
    const response = await request(app)
      .get("/api/v1/users/currentuser")
      .send()
      .expect(200);

    expect(response.body.currentUser).toEqual(null);
  });
});
