import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  limit: process.env.NODE_ENV === "production" ? 5 : 100,
  windowMs: 60000,
  message: { error: "Has alcanzado el límite de peticiones" },
});
