// src/roles/roles.controller.ts

import { Controller, Post, Body, UseGuards, Put } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { OryRoleGuard } from "apps/nestjs/src/guards/ory/ory-role.guard";
import { UseRoles } from "apps/nestjs/src/decorators/ory-decorators";
import { ORY_ROLES } from "apps/nestjs/src/common/ory";
import { UserService } from "../../app/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "apps/nestjs/src/entities/User";
import { Repository } from "typeorm";

@Controller("roles")
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  @Put("admin/add")
  @UseGuards(OryRoleGuard)
  @UseRoles(ORY_ROLES.admin)
  async grantAdminRights(
    @Body("identityId") identityId: string
  ): Promise<void> {
    await this.rolesService.addRole(identityId, ORY_ROLES.admin);

    const user = await this.userService.findUserByOryIdentityId(identityId);
    if (!user) return;

    if (!user.roles.includes(ORY_ROLES.admin)) user.roles.push(ORY_ROLES.admin);

    this.userRepository.save(user);
  }

  @Put("admin/remove")
  @UseGuards(OryRoleGuard)
  @UseRoles(ORY_ROLES.admin)
  async removeAdminRights(
    @Body("identityId") identityId: string
  ): Promise<void> {
    await this.rolesService.removeRole(identityId, ORY_ROLES.admin);

    const user = await this.userService.findUserByOryIdentityId(identityId);
    if (!user) return;

    if (user.roles.includes(ORY_ROLES.admin))
      user.roles = user.roles.filter((role) => role !== ORY_ROLES.admin);

    this.userRepository.save(user);
  }
}
