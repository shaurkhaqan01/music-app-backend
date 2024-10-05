import { Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto } from 'src/common/dtos';
import { PageOptionsDto } from 'src/common/dtos/page-option.dto';
import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationService {
  public async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    pageOptionsDto: PageOptionsDto,
    condition?: FindOptionsWhere<T>['where']
  ) {
    const { page, take } = pageOptionsDto;
    const { where, relations, select, order } = condition;
    const [data, itemCount] = await repository.findAndCount({
      skip: (page - 1) * take,
      take: take,
      where,
      relations,
      select,
      order,
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
  }
}
