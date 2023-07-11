import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { AppGuard } from "src/auth/app.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async findAllUnverified(@Request() req) {
    return await this.usersService.findAll(req.username);
  }

  @UseGuards(new AppGuard())
  @Get(":username")
  async findOne(@Param("username") usermane: string) {
    return await this.usersService.findOne(usermane);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(":username")
  update(
    @Request() req,
    @Param("username") username: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.verify(username, updateUserDto, req.username);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("credentials")
  generateCredentials(@Request() req) {
    return this.usersService.generateCredentials(req.username);
  }
}
