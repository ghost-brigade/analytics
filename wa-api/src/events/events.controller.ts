import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Sse,
  UseGuards,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { Observable } from "rxjs";
import { EventGuard } from "./event.guard";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(EventGuard)
  @Post("")
  async create(@Body() createEventDto: CreateEventDto) {
    return await this.eventsService.create(createEventDto);
  }

  @UseGuards(EventGuard)
  @Post("many")
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
  sse(): Observable<MessageEvent> {
    return this.eventsService.sseEvents();
  }
}
