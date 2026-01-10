import { Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { Prisma } from '@prisma/client';
import bcrypt from "bcrypt";
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getAllUsers() {
    return this.prisma.users.findMany();
  }

  getUser(id: number) {
    return this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(user: CreateUserDto) {
    try {
      const saltRounds = 10;
      user.password = bcrypt.hashSync(user.password, saltRounds);

      const verifyBase = await this.prisma.users.findFirst({
        where: {
          OR: [
            {
              email: user.email,
            },
            {
              cpf: user.cpf,
            },
          ],
        },
      });      

      if (verifyBase) {
        throw new ConflictException('Email ou CPF já cadastrado');
      }

      return this.prisma.users.create({
        data: user,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Dados inválidos');
      }

      throw new InternalServerErrorException('Erro interno do servidor');
    }
  }

  updateUser(id: number, user: any) {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: user,
    });
  }

  deleteUser(id: number) {
    return this.prisma.users.delete({
      where: {
        id,
      },
    });
  }
}