import { Session } from "@ory/client";
import { Request } from "express";

export const ROLES_KEY = "roles";

export enum ORY_ROLES {
  admin = "Admin",
  user = "User",
  customer = "Customer",
}

export enum ORY_RELATIONS {
  memberOf = "member",
}

export interface OryRequest extends Request {
  orySession?: Session; // Optional property to hold Ory session data
}
