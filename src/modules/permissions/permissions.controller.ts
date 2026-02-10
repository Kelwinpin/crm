import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { LinkPermissionDto } from "./dto/linkPermission.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { AuthTokenPayload } from "../auth/dto/authTokenPayload.dto";

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Post('link')
    linkPermission(@Body() linkPermissionDto: LinkPermissionDto) {
        return this.permissionsService.linkPermission(linkPermissionDto);
    }

    @Delete(':id')
    unlinkPermission(@Param('id') id: number) {
        return this.permissionsService.unlinkPermission(id);
    }

    @Get('manage')
    getPermissionToManage(@CurrentUser() user: AuthTokenPayload) {
        return this.permissionsService.getPermissionToManage(user.id);
    }
}