import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

interface Pagination {
  next?: {
    page: number;
    limit: number;
  } | null;
  prev?: {
    page: number;
    limit: number;
  } | null;
}

declare global {
  namespace Express {
    interface Response {
      advancedResults?: {
        pagination: Pagination;
        count: number;
        data: mongoose.Document[];
      };
    }
  }
}

export const advancedResults = (
  model: mongoose.Model<any>,
  populate?: mongoose.ModelPopulateOptions
) => async (req: Request, res: Response, next: NextFunction) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select && typeof req.query.select === "string") {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort && typeof req.query.sort === "string") {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  let page = 1;
  let limit = 25;

  if (req.query.page && typeof req.query.page === "string") {
    page = parseInt(req.query.page, 10);
  }
  if (req.query.limit && typeof req.query.limit === "string") {
    limit = parseInt(req.query.limit, 10);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination result
  let pagination: Pagination = {
    prev: null,
    next: null,
  };

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    count: results.length,
    pagination,
    data: results,
  };

  next();
};
