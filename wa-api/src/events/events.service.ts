import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>
  ) {}

  async create(createEventDto: CreateEventDto): Promise<boolean> {
    try {
      const event = await this.eventsRepository.create(createEventDto);
      await this.eventsRepository.save(event);

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createMany(createEventDto: CreateEventDto[]): Promise<boolean> {
    try {
      const events = await this.eventsRepository.create(createEventDto);
      await this.eventsRepository.save(events);

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
