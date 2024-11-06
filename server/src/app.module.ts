import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from 'db/data-source';
import { LinkLibraryModule } from './modules/link-library/link-library.module';

@Module({
  imports: [TypeOrmModule.forRoot(DataSourceConfig), LinkLibraryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
