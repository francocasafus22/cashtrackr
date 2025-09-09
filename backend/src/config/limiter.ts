import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  limit: 5,
  windowMs: 60000,
  message: { error: "Has alcanzado el límite de peticiones" },
});
