import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Lookup } from "./entities/lookup.entity";
import { LookupService } from "./lookup.service";
import { LookupController } from "./lookup.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Lookup])],
    controllers: [LookupController],
    providers: [LookupService],
})

export class LookupModule {}