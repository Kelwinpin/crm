import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { SegmentsService } from "./segments.service";
import { CreateSegmentDto } from "./dto/createSegment.dto";

@Controller('segments')
export class SegmentsController {
    constructor(private readonly segmentsService: SegmentsService) {}
    
    @Post('create')
    async createSegment(@Body() segment: CreateSegmentDto) {
        return this.segmentsService.createSegment(segment);
    }

    @Delete(':id')
    async unlinkSegment(@Param('id') segmentId: number) {
        return this.segmentsService.unlinkSegment(segmentId);
    }

    @Post('link')
    async linkSegment(@Body() segmentId: number, @Body() customerId: number) {
        return this.segmentsService.linkSegment(segmentId, customerId);
    }
}