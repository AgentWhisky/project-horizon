import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';

@Injectable()
export class RefreshTokenCleanupService implements OnModuleInit {
  private readonly logger = new Logger(RefreshTokenCleanupService.name);

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>
  ) {}

  // Function cleans up tokens on init
  async onModuleInit() {
    await this.cleanupTokens();
  }

  // Function that cleans up tokens at midnight daily
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanExpiredTokensJob() {
    this.cleanupTokens();
  }

  // Function to cleanup expired refresh tokens in the database
  private async cleanupTokens() {
    this.logger.log('Cleaning expired refresh tokens...');

    const now = new Date();
    const expiredTokens = await this.refreshTokenRepository.find({
      where: {
        expiresAt: LessThan(now),
      },
    });

    try {
      if (expiredTokens.length) {
        await this.refreshTokenRepository.remove(expiredTokens);
        this.logger.log(`Cleaned ${expiredTokens.length} expired tokens.`);
      }
    } catch (error) {
      this.logger.log(`Error cleaning expired tokens: ${error}.`);
    }
  }
}
