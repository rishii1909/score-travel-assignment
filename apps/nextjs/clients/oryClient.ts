import { Configuration, FrontendApi as OryApi } from "@ory/client";

export const oryClient = new OryApi(
  new Configuration({
    basePath: "http://localhost:4000", // Replace with your Ory instance URL
    baseOptions: {
      withCredentials: true,
    },
  })
);
