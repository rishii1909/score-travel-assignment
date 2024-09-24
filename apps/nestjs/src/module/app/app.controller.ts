import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { OryGuard } from "../../guards/ory/ory-auth.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("hello")
  @UseGuards(OryGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
