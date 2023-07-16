import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class EventGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { appId, appSecret } = request.body;
    const originHeader = request.headers.origin;

    const isValid = this.validateAppCredentials(appId, appSecret, originHeader);

    return isValid;
  }

  async validateAppCredentials(
    appId: string,
    appSecret: string,
    originHeader: string
  ): Promise<boolean> {
    if (originHeader) {
      const user = await this.usersService.findOneByAppId(appId);
      return !!user;
    } else {
      const user = await this.usersService.findOneByAppId(appId);
      if (!user) {
        return false;
      }
      const isValidAppSecret = user.appSecret === appSecret;
      return isValidAppSecret;
    }
  }
}
