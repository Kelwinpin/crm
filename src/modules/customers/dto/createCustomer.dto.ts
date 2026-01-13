import { CompanySize, CustomerStatus, CustomerType } from "@prisma/client";

export class CreateCustomerDto {
    name: string;
    type: CustomerType;
    cpfCnpj: string;
    email: string;
    phone: string;
    mobile: string;
    website: string;
    address: string;
    addressNumber: string;
    addressComplement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    companySize: CompanySize;
    status: CustomerStatus;
    source: string;
    obs?: string;
    createdBy?: number;
    updatedBy?: number;
    ownerId?: number;
}