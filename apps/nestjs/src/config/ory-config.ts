import { Configuration } from "@ory/client";
import { Configuration as KetoConfiguration } from "@ory/keto-client";

export const oryConfig = new Configuration({
  basePath: process.env.ORY_BASE_URL,
});

export const oryKetoConfig = new KetoConfiguration({
  basePath: process.env.ORY_BASE_URL,
});
