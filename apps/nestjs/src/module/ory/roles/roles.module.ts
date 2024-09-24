import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { UserService } from "../../app/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "apps/nestjs/src/entities/User";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [RolesController],
  providers: [RolesService, UserService],
})
export class RolesModule {}
