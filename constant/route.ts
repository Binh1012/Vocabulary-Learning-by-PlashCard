import { Route } from "expo-router";

export const ROUTES = {
  SPLASH: "/(auth)/splash" as const,
  LOGIN: "/(auth)/login" as const,
  SIGNUP: "/(auth)/signup" as const,
} as const;

export type AppRoutes = (typeof ROUTES)[keyof typeof ROUTES];
