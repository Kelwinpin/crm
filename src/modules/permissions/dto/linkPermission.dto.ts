import { ActionType } from '@prisma/client';
import { IsEnum, IsInt, IsPositive } from 'class-validator';

export class LinkPermissionDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsPositive()
  domPermissionId: number;

  @IsEnum(ActionType)
  action: ActionType;
}