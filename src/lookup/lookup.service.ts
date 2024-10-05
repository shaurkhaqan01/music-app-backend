import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Lookup } from './entities/lookup.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LookupService {
  constructor(
    @InjectRepository(Lookup)
    private readonly lookupRepository: Repository<Lookup>
  ) {}

  async findByType(type: string) {
    return this.lookupRepository.find({
      where: { type },
      select: ['id', 'name'],
    });
  }

  async findTimezone() {
    return this.lookupRepository.find();
  }
}
