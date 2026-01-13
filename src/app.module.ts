import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { SegmentsModule } from './modules/segments/segments.module';
@Module({
  imports: [PrismaModule, UsersModule, AuthModule, PermissionsModule, SegmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
