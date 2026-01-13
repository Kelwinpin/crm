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
                id: customerId,
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
                id: customerId,
            },
            data: customer,
        });
    }

    async deleteCustomer(customerId: number) {
        return this.prisma.customers.update({
            where: {
                id: customerId,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}