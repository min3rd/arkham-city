import { Injectable } from '@nestjs/common';
import { DynamicSchema, Field } from './firestore.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FirestoreService {
  constructor(
    @InjectModel(DynamicSchema.name, 'firestore')
    private readonly dynamicModel: Model<DynamicSchema>,
    @InjectModel(Field.name, 'firestore')
    private readonly fieldModel: Model<Field>,
  ) {}
  async storeSchema(schemaName: string, fields: Field[]) {
    const _fields: any[] = [];
    for (const field of fields) {
      let _field = new this.fieldModel(field);
      _field = await _field.save();
      _fields.push(_field);
    }
    let dynamicSchema = new this.dynamicModel({
      name: schemaName,
      fields: fields,
    });
    dynamicSchema = await dynamicSchema.save();
    return dynamicSchema;
  }
}
