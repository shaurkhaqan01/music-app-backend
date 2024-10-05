import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LookupService } from './lookup.service';

@ApiTags('Lookup')
@Controller('lookup')
@ApiBearerAuth('Authorization')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Get('/:type')
  async findByType(@Param('type') type: string) {
    return this.lookupService.findByType(type);
  }

  @Get('/timezone')
  async findTimezone() {
    return this.lookupService.findTimezone();
  }
}
