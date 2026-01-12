import { Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { Prisma } from '@prisma/client';
import bcrypt from "bcrypt";
import { handlePrismaError } from 'src/shared/utils/handle-prisma-error';
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
      user.password = await bcrypt.hash(user.password, saltRounds);

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
      handlePrismaError(error);
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