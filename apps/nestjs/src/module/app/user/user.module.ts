import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "apps/nestjs/src/entities/User";
import { RolesService } from "../../ory/roles/roles.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, RolesService],
  controllers: [UserController],
})
export class UserModule {}
