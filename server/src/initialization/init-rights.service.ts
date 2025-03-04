import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_RIGHTS_DEFAULT } from 'src/constants';
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

    //await this.rightRepository.upsert(USER_RIGHTS, ['internalName']);

    //await this.rightRepository.createQueryBuilder().insert().into(RightEntity).values(USER_RIGHTS_DEFAULT).orIgnore().execute();
  }
}
