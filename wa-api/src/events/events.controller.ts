import { Controller, Get, Post, Body, Param, Sse } from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { Observable } from "rxjs";
import { interval } from "rxjs";
import { map } from "rxjs/operators";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createMany(@Body() createEventDto: CreateEventDto[]) {
    return await this.eventsService.createMany(createEventDto);
  }

  @Get()
  async findAll() {
    return await this.eventsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.eventsService.findOne(+id);
  }

  @Sse("sse")
  sse(): Observable<Event> {
    return interval(1000).pipe(
      map((count) => ({
        data: `Event ${count}`,
      }))
    );
  }
}
