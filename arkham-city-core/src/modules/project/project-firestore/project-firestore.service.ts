import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { FirestoreService } from '../../firestore/firestore.service';
import {
  BadResponse,
  Errors,
  GoodResponse,
} from '@core/microservice/microservice.types';
import { Pagination } from '@core/core.types';

@Injectable()
export class ProjectFirestoreService {
  private readonly logger = new Logger(ProjectFirestoreService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly firestoreService: FirestoreService,
  ) {}

  /**
   * Query schemas of a project
   * @param projectId
   * @param query
   * @param page
   * @param size
   */
  async querySchemas(
    projectId: string,
    query: object = {},
    page: number = 0,
    size: number = 10,
  ) {
    this.logger.log(`querySchemas:start`, projectId, query, page, size);
    const _query = !query ? { activated: true } : { ...query, activated: true };
    const connection = this.databaseService.createProjectConnection(projectId);
    const schemaModel =
      this.firestoreService.getFirestoreDynamicSchemaModel(connection);
    const schemas = await schemaModel
      .find(_query)
      .skip((page - 1) * size)
      .limit(size);
    this.logger.log(`querySchemas:end`);
    const pagination: Pagination<any> = new Pagination(
      query,
      [],
      page,
      size,
      await schemaModel.countDocuments(_query),
      schemas.map((e) => e.toJSON()),
    );
    return new GoodResponse(pagination);
  }

  /**
   * Query schema records
   * @param projectId
   * @param schemaName
   * @param page
   * @param size
   * @param query
   */
  async querySchemaRecords(
    projectId: string,
    schemaName: string,
    query: object = {},
    page: number = 0,
    size: number = 10,
  ) {
    this.logger.log(
      `querySchemaRecords:start`,
      projectId,
      schemaName,
      page,
      size,
    );
    const _query = !query ? { activated: true } : { ...query, activated: true };
    const connection = this.databaseService.createProjectConnection(projectId);
    const schemaModel =
      this.firestoreService.getFirestoreDynamicSchemaModel(connection);
    const schema = await schemaModel.findOne({
      rawName: schemaName,
    });
    if (!schema) {
      return new BadResponse(
        Errors.PROJECT_FIRESTORE_SCHEMA_COULD_NOT_FOUND_THE_SCHEMA,
      );
    }
    const recordModel = await this.firestoreService.getRecordModel(
      connection,
      schemaName,
    );
    if (!recordModel) {
      return new BadResponse(
        Errors.PROJECT_FIRESTORE_SCHEMA_COULD_NOT_FOUND_THE_SCHEMA_MODEL,
      );
    }
    const records = await recordModel
      .find(_query)
      .skip((page - 1) * size)
      .limit(size);
    this.logger.log(`querySchemaRecords:end`);
    return new GoodResponse(records.map((e) => e.toJSON()));
  }

  /**
   * Get schema record by id
   * @param projectId
   * @param schemaName
   * @param id
   */
  async getSchemaRecordById(projectId: string, schemaName: string, id: string) {
    this.logger.log('getSchemaRecordById:start', projectId, schemaName, id);
    const connection = this.databaseService.createProjectConnection(projectId);
    const recordModel = await this.firestoreService.getRecordModel(
      connection,
      schemaName,
    );
    if (!recordModel) {
      return new BadResponse(
        Errors.PROJECT_FIRESTORE_SCHEMA_COULD_NOT_FOUND_THE_SCHEMA_MODEL,
      );
    }
    const record = await recordModel.findOne({
      _id: id,
      activated: true,
    });
    this.logger.log('getSchemaRecordById:end');
    return new GoodResponse(record ? record.toJSON() : null);
  }

  /**
   * Create a new schema record
   * @param projectId
   * @param schemaName
   * @param data
   */
  async createSchemaRecord(
    projectId: string,
    schemaName: string,
    data: object,
  ) {
    this.logger.log('createSchemaRecord:start', projectId, schemaName, data);
    const connection = this.databaseService.createProjectConnection(projectId);
    const recordModel = await this.firestoreService.getRecordModel(
      connection,
      schemaName,
    );
    if (!recordModel) {
      return new BadResponse(
        Errors.PROJECT_FIRESTORE_SCHEMA_COULD_NOT_FOUND_THE_SCHEMA_MODEL,
      );
    }
    const record = new recordModel(data);
    await record.save();
    this.logger.log('createSchemaRecord:end', record);
    return new GoodResponse(record.toJSON());
  }

  /**
   * Update a schema record
   * @param projectId
   * @param schemaName
   * @param id
   * @param data
   */
  async updateSchemaRecord(
    projectId: string,
    schemaName: string,
    id: string,
    data: object,
  ) {
    const connection = this.databaseService.createProjectConnection(projectId);
    const recordModel = await this.firestoreService.getRecordModel(
      connection,
      schemaName,
    );
    if (!recordModel) {
      return new BadResponse(
        Errors.PROJECT_FIRESTORE_SCHEMA_COULD_NOT_FOUND_THE_SCHEMA_MODEL,
      );
    }
    let record = await recordModel.findOne({
      _id: id,
      activated: true,
    });
    if (!record) {
      return new BadResponse(
        Errors.PROJECT_FIRESTORE_SCHEMA_COULD_NOT_FOUND_THE_RECORD,
      );
    }

    record = await recordModel.findOneAndUpdate(
      { _id: id, activated: true },
      data,
      {
        new: true,
      },
    );

    if (!record) {
      return new BadResponse(
        Errors.PROJECT_FIRESTORE_SCHEMA_COULD_NOT_UPDATE_THE_RECORD,
      );
    }
    this.logger.log('updateSchemaRecord:end', record);
    return new GoodResponse(record.toJSON());
  }

  /**
   * Delete a schema record
   * @param projectId
   * @param schemaName
   * @param id
   */
  async deleteSchemaRecord(projectId: string, schemaName: string, id: string) {
    this.logger.log('deleteSchemaRecord:start', projectId, schemaName, id);
    const connection = this.databaseService.createProjectConnection(projectId);
    const recordModel = await this.firestoreService.getRecordModel(
      connection,
      schemaName,
    );
    if (!recordModel) {
      return new BadResponse(
        Errors.PROJECT_FIRESTORE_SCHEMA_COULD_NOT_FOUND_THE_SCHEMA_MODEL,
      );
    }
    const record = await recordModel.findOneAndUpdate(
      {
        _id: id,
      },
      { activated: false },
      {
        new: true,
      },
    );
    if (!record) {
      return new BadResponse(
        Errors.PROJECT_FIRESTORE_SCHEMA_COULD_NOT_UPDATE_THE_RECORD,
      );
    }
    this.logger.log('deleteSchemaRecord:end', record);
    return new GoodResponse(record.toJSON());
  }
}
