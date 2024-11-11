import { Module } from "@nestjs/common";
import { LinkLibraryService } from "./link-library.service";
import { LinkLibraryController } from "./link-library.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinkEntity } from "./entities/link.entity";
import { LinkTagEntity } from "./entities/link-tags.entity";

@Module({
  imports: [TypeOrmModule.forFeature([LinkEntity, LinkTagEntity])],
  controllers: [LinkLibraryController],
  providers: [LinkLibraryService],
})
export class LinkLibraryModule {}
