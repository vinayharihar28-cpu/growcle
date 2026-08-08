import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // The baseURL will default to the origin of the current page
  // If your frontend and backend run on different domains in production, specify baseURL here.
});
