import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

import { Answer } from "../../models/answer";

describe("Get all question route", () => {
  it("not return 404", async () => {});
});

describe("Get by id question route", () => {
  it("not return 404", async () => {});
});

describe("Create new question route", () => {
  it("not return 404", async () => {});

  it("returns 401 if user is not signed in", async () => {});

  it("returns 400 with an invalid content", async () => {});

  it("returns 400 with an invalid questionId", async () => {});

  it("creates a question with valid inputs", async () => {});
});

describe("Update question route", () => {
  it("return 404 if answer is not found", async () => {});

  it("not return 404 if answer is found", async () => {});
});
