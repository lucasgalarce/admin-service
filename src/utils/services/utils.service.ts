import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
  SaveOptions,
} from 'typeorm';

import { EntityBase } from '../entity/entity-base';

export abstract class UtilsService<T extends EntityBase> {
  protected abstract getRepository(): Repository<T>;

  public async findAll(t?: FindManyOptions<T>) {
    return this.getRepository().find(t);
  }

  public async findById(id: string) {
    return this.getRepository().createQueryBuilder().where('id = :id', { id }).getOne();
  }

  public async findByIdOrFail(id: string) {
    const object = await this.getRepository()
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
    if (!object) throw new NotFoundException(`Object with id ${id} not found`);
    return object;
  }

  public async findByIds(ids: string[]) {
    return this.getRepository().findBy({
      id: In(ids),
    } as FindOptionsWhere<T>);
  }

  public async findOneByFilter(t: FindOneOptions<T>) {
    return this.getRepository().findOne(t);
  }

  public async delete(id: string) {
    return this.getRepository().softDelete(id);
  }

  public async deleteOrFail(id: string) {
    await this.findByIdOrFail(id);
    return this.getRepository().softDelete(id);
  }

  public async deleteHard(id: string) {
    return this.getRepository().delete(id);
  }

  public async create(
    payload: DeepPartial<T>,
    data?: SaveOptions & {
      reload: false;
    },
  ) {
    const entity = await this.getRepository().create(payload);
    return this.getRepository().save(entity, data);
  }

  public async updateById(id: string, payload: DeepPartial<T>, data?: SaveOptions) {
    const object = await this.findByIdOrFail(id);
    const entity = Object.assign(object, payload);
    await this.getRepository().save(entity, { data });
  }
}
