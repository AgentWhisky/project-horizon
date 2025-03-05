import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingEntity } from 'src/entities/settings.entity';
import { Repository } from 'typeorm';
import { CREATION_CODE_FIELD, CREATION_CODE_LENGTH } from 'src/constants';
import { generateCode } from 'src/utils/generate-codes';
import { AdminDashboardInfo, CreationCodeRefresh } from './admin-dashboard.model';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>
  ) {}

  async getDashboard(): Promise<AdminDashboardInfo> {
    const settings = await this.settingRepository.find({
      select: ['key', 'value'],
      where: { key: CREATION_CODE_FIELD },
    });

    const settingsMap = new Map(settings.map((s) => [s.key, s.value]));

    return {
      creationCode: settingsMap.get(CREATION_CODE_FIELD) || '',
    };
  }

  async refreshCreationCode(): Promise<CreationCodeRefresh> {
    const creationCode = generateCode(CREATION_CODE_LENGTH);

    await this.settingRepository.save({
      key: CREATION_CODE_FIELD,
      value: creationCode,
    });

    return { creationCode };
  }
}
