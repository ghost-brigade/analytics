import { Module } from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventsController } from "./events.controller";
import { Event } from "./entities/event.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [EventsController],
  providers: [EventsService, UsersService],
})
export class EventsModule {}
