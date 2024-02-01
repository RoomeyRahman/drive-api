import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsS3Controller } from './controllers';
import { AwsS3Service } from './services';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';
import { File } from './entities/files.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([File])
  ],
  controllers: [AwsS3Controller, FilesController],
  providers: [
    AwsS3Service,
    FilesService,
  ],
})
export class FilesModule {}
