import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @ApiProperty({ required: false, example: 'Anderson' })
  @IsString()
  @IsOptional()
  filter?: string;

  @ApiProperty({ required: false, example: 'Pending' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ enum: Order, default: Order.DESC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;
}
