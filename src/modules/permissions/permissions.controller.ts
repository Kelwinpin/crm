import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { LinkPermissionDto } from "./dto/linkPermission.dto";
import { Type } from "class-transformer";

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Post('link')
    linkPermission(@Body() linkPermissionDto: LinkPermissionDto) {
        return this.permissionsService.linkPermission(linkPermissionDto);
    }

    @Delete(':id')
    @Type(() => Number)
    unlinkPermission(@Param('id') id: number) {
        return this.permissionsService.unlinkPermission(id);
    }
}