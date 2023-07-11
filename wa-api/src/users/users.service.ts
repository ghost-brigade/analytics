import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { ulid } from "ulid";
import { randomBytes } from "crypto";
import { AppGuard } from "src/auth/app.guard";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const { password, ...user } = await this.userRepository.save(createUserDto);
    return user;
  }

  async findAll(username: string) {
    const currentUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!currentUser || currentUser.role !== "admin") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    const users = await this.userRepository.find({
      where: { adminVerified: false, role: "user" },
    });

    return users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findOneByAppId(appId: string) {
    return await this.userRepository.findOne({ where: { appId } });
  }

  async generateCredentials(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    this.userRepository.update(user.id, {
      appId: ulid(),
      appSecret: randomBytes(256 / 8).toString("hex"),
    });
  }

  async verify(
    username: string,
    updateUserDto: UpdateUserDto,
    currentUsername: string
  ) {
    const currentUser = await this.findOne(currentUsername);
    if (!currentUser || currentUser.role !== "admin") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    const user = await this.findOne(username);
    if (!user) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    user.adminVerified = updateUserDto.adminVerified;
    await this.userRepository.save(user);
    return {
      adminVerified: user.adminVerified,
    };
  }
}
