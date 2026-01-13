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
}