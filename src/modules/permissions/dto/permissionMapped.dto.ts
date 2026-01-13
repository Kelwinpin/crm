import { ActionType } from "@prisma/client";

export class PermissionMappedDto {
  id: number;
  permissionId: number;
  action: ActionType;
  permission: string;
}