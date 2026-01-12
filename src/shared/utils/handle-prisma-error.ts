import { 
  ConflictException, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: any): never {
  if (error instanceof ConflictException) {
    throw error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    throw new BadRequestException('Dados inválidos');
  }
  
  console.error(error);
  
  throw new InternalServerErrorException('Erro interno do servidor');
}