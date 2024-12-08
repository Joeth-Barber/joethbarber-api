import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvService } from "./env/env.service";
import { IoAdapter } from "@nestjs/platform-socket.io";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    },
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  const configService = app.get(EnvService);
  const port = configService.get("PORT");

  await app.listen(port);
}
bootstrap();
