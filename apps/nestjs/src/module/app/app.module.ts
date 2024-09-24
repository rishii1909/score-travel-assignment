import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/User";
import { RolesModule } from "../ory/roles/roles.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "pass",
      database: "postgres",
      entities: [User],
      synchronize: true, // Automatically create database schema
    }),
    TypeOrmModule.forFeature([User]),
    RolesModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
