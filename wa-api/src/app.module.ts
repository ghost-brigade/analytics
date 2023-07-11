import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { TagsModule } from "./tags/tags.module";
import { EventsModule } from "./events/events.module";
import { AuthModule } from "./auth/auth.module";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "better-sqlite3",
      database: "db/db.sqlite",
      entities: [join(__dirname, "**", "*.entity.{ts,js}")],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    UsersModule,
    TagsModule,
    EventsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
