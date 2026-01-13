import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCustomerDto } from "./dto/createCustomer.dto";

@Injectable()
export class CustomersService {
    constructor(private prisma: PrismaService) {}

    async getCustomers() {
        return this.prisma.customers.findMany();
    }

    async getCustomerById(customerId: number) {
        return this.prisma.customers.findUnique({
            where: {
                id: Number(customerId),
            },
        });
    }

    async getCustomersByOwnerId(ownerId: number) {
        return this.prisma.customers.findMany({
            where: {
                ownerId: Number(ownerId),
            },
        });
    }

    async createCustomer(customer: CreateCustomerDto) {
        return this.prisma.customers.create({
            data: customer,
        });
    }

    async updateCustomer(customerId: number, customer: CreateCustomerDto) {
        return this.prisma.customers.update({
            where: {
                id: Number(customerId),
            },
            data: customer,
        });
    }

    async deactivateCustomer(customerId: number) {
        return this.prisma.customers.update({
            where: {
                id: Number(customerId),
            },
            data: {
                status: 'inactive',
                deletedAt: new Date(),
            },
        });
    }

    async reactivateCustomer(customerId: number) {
        return this.prisma.customers.update({
            where: {
                id: Number(customerId),
            },
            data: {
                status: 'active',
                deletedAt: null,
            },
        });
    }

    async deleteCustomer(customerId: number) {
        return this.prisma.customers.update({
            where: {
                id: Number(customerId),
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}