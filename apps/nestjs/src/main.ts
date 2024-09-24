import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module/app/app.module";
import { OryGuard } from "./guards/ory/ory-auth.guard";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: "http://localhost:3000", // Allow all origins
    credentials: true, // Allow credentials (cookies)
  });

  // Use global guards
  app.useGlobalGuards(new OryGuard());

  await app.listen(8000);
};

bootstrap();
