import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { TagsController } from "./tags.controller";
import { DynamicCorsMiddleware } from "src/middlewares/cors.middleware";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DynamicCorsMiddleware).forRoutes("/tags");
  }
}
