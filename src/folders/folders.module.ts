import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { Folder } from './entities/folder.entity';
import { User } from '../users/entities/user.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, User])
  ],
  controllers: [FoldersController],
  providers: [FoldersService]
})
export class FoldersModule {}
