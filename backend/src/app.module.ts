import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';

/**
 * Root module. Feature modules land here as Phase 1 progresses
 * (onboarding, habits, check-ins, chat, governor, coach-tick) — see docs/09 §7.
 */
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
