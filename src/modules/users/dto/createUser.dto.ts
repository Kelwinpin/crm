import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(11)
  @IsNotEmpty()
  cpf: string;
  
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  password: string;
  
  @IsNotEmpty()
  phoneNumber: string;
}