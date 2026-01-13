import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PERMISSIONS_KEY, PermissionRequirement } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionRequirement[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const permissionsToken = request.headers['x-permissions'];

    if (!permissionsToken) {
      throw new ForbiddenException('Token de permissões não fornecido');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(permissionsToken);
      const userPermissions = decoded.permissions || [];

      const hasAllPermissions = requiredPermissions.every((requirement) => {
        return requirement.actions.every((action) => {
          return userPermissions.some(
            (userPerm: any) =>
              userPerm.permission === requirement.resource &&
              userPerm.action === action,
          );
        });
      });

      if (!hasAllPermissions) {
        throw new ForbiddenException('Você não tem permissão para acessar este recurso');
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Token de permissões inválido');
    }
  }
}
