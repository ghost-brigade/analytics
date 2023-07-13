import { EventType } from "../types/Event";

export class CreateEventDto {
  type: EventType;
  data: {
    url: string;
    id: string;
    appId: string;
    timestamp: number;
  };
}
