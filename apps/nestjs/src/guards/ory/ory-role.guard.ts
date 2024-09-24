import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ORY_RELATIONS, ORY_ROLES, OryRequest } from "../../common/ory";
import {
  OryPermissionsClient,
  OryRelationShipsClient,
} from "../../clients/ory-clients";
import { AxiosError } from "axios";

export const ROLES_KEY = "roles";
const PERMISSIONS_ERROR = "You do not have permission to perform this action.";

@Injectable()
export class OryRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: OryRequest = context
        .switchToHttp()
        .getRequest<OryRequest>();
      const requiredRoles = this.reflector.getAllAndOverride<ORY_ROLES[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()]
      );

      if (!requiredRoles) return true;

      return await this.validateRole(request, requiredRoles);
    } catch (error) {
      if (error instanceof AxiosError) console.error(error.response?.data);
      return false;
    }
  }

  private async validateRole(
    request: OryRequest,
    requiredRoles: ORY_ROLES[]
  ): Promise<boolean> {
    const session = request["orySession"];
    const identityId = session?.identity?.id;

    if (!identityId) {
      throw new ForbiddenException("Session not found");
    }

    const response = await OryRelationShipsClient.getRelationships({
      namespace: ORY_ROLES.admin,
      object: ORY_ROLES.admin,
      relation: ORY_RELATIONS.memberOf,
      subjectId: identityId,
    });

    const checkAllPermissions = await Promise.all(
      requiredRoles.map((requiredRole) =>
        // IMPORTANT: This is the only checkPermission API that works properly.
        OryPermissionsClient.postCheckPermission({
          namespace: requiredRole,
          object: requiredRole,
          relation: ORY_RELATIONS.memberOf,
          subjectId: identityId,
        } as any)
      )
    );

    if (!checkAllPermissions.some(({ data }) => !data.allowed)) {
      throw new ForbiddenException(PERMISSIONS_ERROR);
    }

    return true;
  }
}
