import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(3)
  @MaxLength(50)
  username: string;

  @MinLength(8)
  password: string;

  @IsNotEmpty()
  company: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsUrl()
  baseUrl: string;

  @Equals("user")
  role: "admin" | "user";
}
