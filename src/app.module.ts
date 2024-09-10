import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {dataSourceOptions} from "@studENV/shared/dist/typeorm/typeorm.config";
import {DataSourceOptions} from "typeorm";
import {SeedingModule} from "./seeding/seeding.module";

@Module({
  imports: [
      UserModule,
      TypeOrmModule.forRoot(dataSourceOptions as DataSourceOptions),
      UserModule,
      SeedingModule
  ],
  controllers: [],
  providers: [TypeOrmModule],
})
export class AppModule {}
