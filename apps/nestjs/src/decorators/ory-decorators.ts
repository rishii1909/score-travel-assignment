import { SetMetadata } from "@nestjs/common";
import { ORY_ROLES, ROLES_KEY } from "../common/ory";

export const UseRoles = (...roles: ORY_ROLES[]) =>
  SetMetadata(ROLES_KEY, roles);
