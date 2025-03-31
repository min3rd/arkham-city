import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { App, AppSchema } from "./app.type";
import { AppService } from "./app.service";
import { HashService } from "src/core/hash/hash.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(
      [{ name: App.name, schema: AppSchema }],
      "metadata",
    ),
  ],
  providers: [HashService, AppService],
  exports: [AppService],
})
export class AppModule {}
