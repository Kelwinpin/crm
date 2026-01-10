import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
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
  phoneNumber: string;
}