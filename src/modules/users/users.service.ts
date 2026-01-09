import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  createUser(user: any) {
    return this.prisma.users.create({
      data: user,
    });
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