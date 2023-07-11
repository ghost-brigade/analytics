import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "src/users/users.service";

@Injectable()
export class DynamicCorsMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.usersService.findOneByAppId(req.body.appId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.header("Access-Control-Allow-Origin", user.baseUrl);
    next();
  }
}
