import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      locale: "en" | "es" | "fr" | "ch";
    }
  }
}
