import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export const testEnvironment = "node";
export const testTimeout = 20 * 1000;
export const openHandlesTimeout = 20 * 1000;
export const transform = {
  ...tsJestTransformCfg,
};
