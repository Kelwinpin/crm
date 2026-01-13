import { ActionType } from "@prisma/client";

export class PermissionDto {
  id: number;
  userId: number;
  domPermissionId: number;
  action: ActionType;
  domPermission: {
    id: number;
    name: string;
  };
}