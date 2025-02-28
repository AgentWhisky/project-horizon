import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RightEntity } from 'src/entities/right.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InitRightService implements OnModuleInit {
  constructor(
    @InjectRepository(RightEntity)
    private readonly rightRepository: Repository<RightEntity>
  ) {}

  async onModuleInit() {
    console.log('Initializing user rights...');
  }
}
