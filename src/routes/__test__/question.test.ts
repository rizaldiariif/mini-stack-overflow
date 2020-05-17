import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

import { Question } from "../../models/question";

describe("Get all question route", () => {
  it("not return 404", async () => {
    const response = await request(app).get("/api/v1/questions").send();

    expect(response.status).not.toEqual(404);
  });
});

describe("Get by id question route", () => {
  it("not return 404", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app).get(`/api/v1/questions/${id}`).send();

    expect(response.status).not.toEqual(404);
  });
});

describe("Create new question route", () => {
  it("not return 404", async () => {
    const response = await request(app).post("/api/v1/questions").send({});

    expect(response.status).not.toEqual(404);
  });

  it("returns 401 if user is not signed in", async () => {
    await request(app)
      .post("/api/v1/questions")
      .send({ title: "question", description: "test" })
      .expect(401);
  });

  it("returns 400 with an invalid title", async () => {
    const cookie = await global.signin();

    await request(app)
      .post("/api/v1/questions")
      .set("Cookie", cookie)
      .send({ description: "test" })
      .expect(400);
  });

  it("returns 400 with an invalid description", async () => {
    const cookie = await global.signin();

    await request(app)
      .post("/api/v1/questions")
      .set("Cookie", cookie)
      .send({ title: "question" })
      .expect(400);
  });

  it("creates a question with valid inputs", async () => {
    let questions = await Question.find({});
    expect(questions.length).toEqual(0);

    const title = "question 1";
    const description = "description 1";

    await request(app)
      .post("/api/v1/questions")
      .set("Cookie", global.signin())
      .send({
        title,
        description,
      })
      .expect(201);

    questions = await Question.find({});
    expect(questions.length).toEqual(1);
    expect(questions[0].title).toEqual(title);
    expect(questions[0].description).toEqual(description);
  });
});

describe("Update question route", () => {
  it("return 404 if ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .post(`/api/v1/questions/${id}`)
      .set("Cookie", global.signin())
      .send({
        title: "test update",
        description: "test update",
      })
      .expect(404);
  });

  it("not return 404 if ticket is found", async () => {
    const cookie = await global.signin();

    let response = await request(app)
      .post("/api/v1/questions")
      .set("Cookie", cookie)
      .send({
        title: "test",
        description: "test",
      })
      .expect(201);

    await request(app)
      .post(`/api/v1/questions/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "test update",
        description: "test",
      })
      .expect(200);
  });
});
