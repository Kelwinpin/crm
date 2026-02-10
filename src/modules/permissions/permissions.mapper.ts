import { Modules } from "src/shared/constants";
import { PermissionDto } from "./dto/permission.dto";

export class PermissionsMapper {
    static toDto(permissions: PermissionDto[]) {
        return permissions.map((permission) => {
            return {
                id: permission.id,
                permissionId: permission.domPermissionId,
                action: permission.action,
                permission: permission.domPermission.name,
            };
        });
    }

    static toManage(permissions: PermissionDto[]) {
        return permissions.map((permission) => {
            return {
                permissionId: permission.domPermissionId,
                permission: Modules[permission.domPermission.name],
            };
        });
    }
}