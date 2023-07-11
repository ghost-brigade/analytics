import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { AuthLoginDto } from "./dto/auth-login.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (
      user &&
      (await bcrypt.compare(password, user.password)) &&
      user.adminVerified
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: AuthLoginDto) {
    const user = await this.usersService.findOne(loginDto.username);
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
