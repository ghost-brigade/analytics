import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Observable, interval, map, mergeMap } from "rxjs";

@Injectable()
export class EventsService {
  sseEventsObservable: Observable<MessageEvent<string>> = new Observable();
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>
  ) {}

  sseEvents(): Observable<MessageEvent<string>> {
    return this.sseEventsObservable;
  }

  async create(createEventDto: CreateEventDto): Promise<boolean> {
    try {
      const event = await this.eventsRepository.create(createEventDto);
      await this.eventsRepository.save(event);
      this.sseEventsObservable.pipe(map(() => event));

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createMany(createEventDto: CreateEventDto[]): Promise<boolean> {
    try {
      const events = await this.eventsRepository.create(createEventDto);
      await this.eventsRepository.save(events);
      this.sseEventsObservable.pipe(map(() => events));

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    const events = await this.eventsRepository.find();
    return events;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }
}
