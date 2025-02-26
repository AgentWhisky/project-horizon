import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './users.entity';

@Entity('refresh_token')
export class RefreshTokenEntity {
  @PrimaryColumn({ name: 'jti' })
  jti: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ name: 'token', type: 'text' })
  token: string;

  @Column({ name: 'expiresAt', type: 'timestamp' })
  expiresAt: Date;

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'createdDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updatedDate', type: 'timestamp' })
  updatedDate: Date;
}
