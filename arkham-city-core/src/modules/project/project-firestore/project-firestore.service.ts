import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { FirestoreService } from '../../firestore/firestore.service';

@Injectable()
export class ProjectFirestoreService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly firestoreService: FirestoreService,
  ) {}

  /**
   * Get all schemas of a project
   * @param projectId
   */
  async getAllSchemas(projectId: string) {
    const connection = this.databaseService.createProjectConnection(projectId);
    const schemaModel =
      this.firestoreService.getFirestoreDynamicSchemaModel(connection);
    const schemas = await schemaModel.find();
    return schemas.map((e) => e.toJSON());
  }

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
    const connection = this.databaseService.createProjectConnection(projectId);
    const schemaModel =
      this.firestoreService.getFirestoreDynamicSchemaModel(connection);
    const schemas = await schemaModel.find(query, {
      skip: page * size,
      limit: size,
    });
    return schemas.map((e) => e.toJSON());
  }

  /**
   * Find schema by id
   * @param projectId
   * @param schemaId
   */
  async findSchemaById(projectId: string, schemaId: string) {
    const connection = this.databaseService.createProjectConnection(projectId);
    const schemaModel =
      this.firestoreService.getFirestoreDynamicSchemaModel(connection);
    const schema = await schemaModel.findById(schemaId);
    return schema ? schema.toJSON() : null;
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
    page: number = 0,
    size: number = 10,
    query: object,
  ) {
    const connection = this.databaseService.createProjectConnection(projectId);
    const schemaModel =
      this.firestoreService.getFirestoreDynamicSchemaModel(connection);
    const schema = await schemaModel.findOne({
      name: schemaName,
    });
    if (!schema) {
      return null;
    }
    const recordModel = await this.firestoreService.getRecordModel(
      connection,
      schemaName,
    );
    if (!recordModel) {
      return null;
    }
    const records = await recordModel.find(query, {
      skip: page * size,
      limit: size,
    });
    return records.map((e) => e.toJSON());
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
    const connection = this.databaseService.createProjectConnection(projectId);
    const recordModel = await this.firestoreService.getRecordModel(
      connection,
      schemaName,
    );
    if (!recordModel) {
      return null;
    }
    const record = new recordModel(data);
    await record.save();
    return record.toJSON();
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
      return null;
    }
    let record = await recordModel.findById(id);
    if (!record) {
      return null;
    }

    record = await recordModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    if (!record) {
      return null;
    }
    return record.toJSON();
  }

  /**
   * Delete a schema record
   * @param projectId
   * @param schemaName
   * @param id
   */
  async deleteSchemaRecord(projectId: string, schemaName: string, id: string) {
    const connection = this.databaseService.createProjectConnection(projectId);
    const recordModel = await this.firestoreService.getRecordModel(
      connection,
      schemaName,
    );
    if (!recordModel) {
      return null;
    }
    const record = await recordModel.findByIdAndDelete(id);
    if (!record) {
      return null;
    }
    return record.toJSON();
  }
}
