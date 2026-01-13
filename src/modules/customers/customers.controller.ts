import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/createCustomer.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthTokenPayload } from "../auth/dto/authTokenPayload.dto";

@Controller('customers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}

    @Get()
    @RequirePermissions({ resource: 'customers', actions: ['READ'] })
    async getCustomers() {
        return this.customersService.getCustomers();
    }

    @Get(':id')
    @RequirePermissions({ resource: 'customers', actions: ['READ'] })
    async getCustomerById(@Param('id') customerId: number) {
        return this.customersService.getCustomerById(customerId);
    }

    @Post()
    @RequirePermissions({ resource: 'customers', actions: ['CREATE'] })
    async createCustomer(@Body() customer: CreateCustomerDto, @CurrentUser() user: AuthTokenPayload) {
        customer.createdBy = user.id;
        customer.updatedBy = user.id;
        customer.ownerId = user.id;
        
        return this.customersService.createCustomer(customer);
    }

    @Put(':id')
    @RequirePermissions({ resource: 'customers', actions: ['UPDATE'] })
    async updateCustomer(@Param('id') customerId: number, @Body() customer: CreateCustomerDto) {
        return this.customersService.updateCustomer(customerId, customer);
    }

    @Delete(':id')
    @RequirePermissions({ resource: 'customers', actions: ['DELETE'] })
    async deleteCustomer(@Param('id') customerId: number) {
        return this.customersService.deleteCustomer(customerId);
    }

    @Get('owner/:id')
    @RequirePermissions({ resource: 'customers', actions: ['READ'] })
    async getCustomersByOwnerId(@Param('id') ownerId: number) {
        return this.customersService.getCustomersByOwnerId(ownerId);
    }

    @Post('deactivate')
    @RequirePermissions({ resource: 'customers', actions: ['UPDATE'] })
    async deactivateCustomer(@Body() customerId: number) {
        return this.customersService.deactivateCustomer(customerId);
    }

    @Post('reactivate')
    @RequirePermissions({ resource: 'customers', actions: ['UPDATE'] })
    async reactivateCustomer(@Body() customerId: number) {
        return this.customersService.reactivateCustomer(customerId);
    }
}