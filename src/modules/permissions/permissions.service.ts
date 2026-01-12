import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LinkPermissionDto } from "./dto/linkPermission.dto";
import { handlePrismaError } from "src/shared/utils/handle-prisma-error";

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}
  
  async linkPermission(linkPermissionDto: LinkPermissionDto) {
    try {
        const permission = await this.prisma.permissions.count({
            where: {
                userId: linkPermissionDto.userId,
                domPermissionId: linkPermissionDto.domPermissionId,
                action: linkPermissionDto.action,
            },
        });        

        if (permission) {
           throw new ConflictException('Permissão já existente');
        }

       return this.prisma.permissions.create({
            data: linkPermissionDto,
        });
    } catch (error) {
        handlePrismaError(error);
    }
  }

  async getPermissionsByUserId(userId: number) {
    return this.prisma.permissions.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async getPermissionsByDomId(domId: number) {
    return this.prisma.permissions.findMany({
      where: {
        domPermissionId: domId,
      },
    });
  }

  async unlinkPermission(permissionId: number) {    
    return this.prisma.permissions.delete({
        where: {
          id: Number(permissionId),
        },
    });
  }
}   