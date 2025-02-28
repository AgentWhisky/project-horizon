import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';

@Injectable()
export class RefreshTokenCleanupService implements OnModuleInit {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>
  ) {}

  // Function cleans up tokens on init
  async onModuleInit() {
    console.log('Cleaning expired refresh tokens...');
    this.cleanupTokens();
  }

  // Function that cleans up tokens at midnight daily
  @Cron('0 0 * * *')
  async cleanExpiredTokensAuto() {
    this.cleanupTokens();
  }

  // Function that cleans up tokens on demand
  async cleanExpiredTokens() {
    this.cleanupTokens();
  }

  // Function to cleanup expired refresh tokens in the database
  private async cleanupTokens() {
    const now = new Date();
    const expiredTokens = await this.refreshTokenRepository.find({
      where: {
        expiresAt: LessThan(now),
      },
    });

    try {
      if (expiredTokens.length) {
        await this.refreshTokenRepository.remove(expiredTokens);
        console.log(`Cleaned ${expiredTokens.length} expired tokens.`);
      }
    } catch (error) {
      console.error(`Error cleaning expired tokens: ${error}.`);
    }
  }
}
