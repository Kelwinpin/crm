import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSegmentDto } from "./dto/createSegment.dto";

@Injectable()
export class SegmentsService {
    constructor(private prisma: PrismaService) {}

    async getSegmentsByCustomerId(customerId: number) {
        return this.prisma.segments.findMany({
            where: {
                customerId: customerId,
            },
        });
    }

    async getSegmentsByDomSegmentId(domSegmentId: number) {
        return this.prisma.segments.findMany({
            where: {
                domSegmentId: domSegmentId,
            },
        });
    }

    async createSegment(segment: CreateSegmentDto) {
        return this.prisma.dom_segments.create({
            data: segment,
        });
    }

    async unlinkSegment(segmentId: number) {
        return this.prisma.segments.delete({
            where: {
                id: segmentId,
            },
        });
    }

    async linkSegment(segmentId: number, customerId: number) {
        return this.prisma.segments.create({
            data: {
                customerId: customerId,
                domSegmentId: segmentId,
            },
        });
    }
}