import {
  Controller,
  Post,
  Body,
  Request,
  UnauthorizedException,
  Put,
  UseGuards,
  Get,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "apps/nestjs/src/entities/User";
import { ORY_ROLES, OryRequest } from "apps/nestjs/src/common/ory";
import { RolesService } from "../../ory/roles/roles.service";
import { OryRoleGuard } from "apps/nestjs/src/guards/ory/ory-role.guard";
import { UseRoles } from "apps/nestjs/src/decorators/ory-decorators";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rolesService: RolesService
  ) {}

  @Put("/login")
  async LoginUser(
    @Request() req: OryRequest
  ): Promise<{ roles: ORY_ROLES[]; user: User }> {
    const session = req["orySession"];
    if (!session?.identity) throw new UnauthorizedException("Invalid session");

    const { id: oryIdentityId, traits } = session?.identity;
    const email = traits.email;

    const roles = await this.rolesService.getRoles(oryIdentityId);

    const user = await this.userService.upsertUser({
      email,
      oryIdentityId,
      roles,
    });

    if (!roles.includes(ORY_ROLES.customer)) {
      await this.rolesService.addRole(oryIdentityId, ORY_ROLES.customer);

      const updatedRoles = await this.rolesService.getRoles(oryIdentityId);
      const user = await this.userService.upsertUser({
        email,
        oryIdentityId,
        roles: updatedRoles,
      });

      return { roles: updatedRoles, user };
    }
    return { roles, user };
  }

  @Get("/list")
  @UseGuards(OryRoleGuard)
  @UseRoles(ORY_ROLES.admin)
  async listUsers(): Promise<User[]> {
    return this.userService.listUsers();
  }
}
