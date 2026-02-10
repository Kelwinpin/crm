import { Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { Prisma } from '@prisma/client';
import bcrypt from "bcrypt";
import { handlePrismaError } from 'src/shared/utils/handle-prisma-error';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(page: number, limit: number, search: string) {
    let where : Prisma.usersWhereInput = {};
    
    if (search) {
      if (search.includes('@')) {
        where = {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        };
      } else if(/^[0-9]+$/.test(search)) {
        where = {
          cpf: {
            contains: search,
          },
        };
      } else {
        where = {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        };
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.users.findMany({
        ...(Object.keys(where).length > 0 && { where }),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        omit: {
          password: true,
        },
      }),
      this.prisma.users.count({
        ...(Object.keys(where).length > 0 && { where }),
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
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