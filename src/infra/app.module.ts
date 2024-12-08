import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvModule } from "./env/env.module";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { HttpModule } from "./http/http.module";
import { WebSocketModule } from "./http/ws/websocket.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    EnvModule,
    HttpModule,
  ],
})
export class AppModule {}
