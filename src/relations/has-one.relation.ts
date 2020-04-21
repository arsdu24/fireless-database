import { EntitySchema } from '../schema';
import { EntityUpdateQuery, HasOneResolver, PlainEntity } from '../types';

export class HasOneRelation<Parent extends {}, Child extends {}> {
  private readonly primaryKey: keyof Parent;
  private readonly foreignKey: keyof Child;

  constructor(
    private parentSchema: EntitySchema<Parent>,
    private childSchema: EntitySchema<Child>,
  ) {
    const parentName: string = parentSchema.getEntityConstructor().name;
    const childName: string = childSchema.getEntityConstructor().name;
    const primaryKey: keyof Parent | undefined = parentSchema.getPrimaryKey();
    const foreignKey: keyof Child | undefined = childSchema.getForeignKeyFor(
      parentSchema,
    );

    if (!primaryKey) {
      throw new Error(
        `Entity '${parentName}' has no property marked as @PrimaryKey`,
      );
    }

    if (!foreignKey) {
      throw new Error(
        `Entity '${childName}' has no property marked as @ForeignKey for Entity '${parentName}'`,
      );
    }

    this.primaryKey = primaryKey;
    this.foreignKey = foreignKey;
  }

  create(parent: Parent): HasOneResolver<Child> {
    const resolver: () => Promise<Child | undefined> = async () =>
      this.parentSchema.getDatabaseDriver().findOne<Child>(this.childSchema, {
        [this.foreignKey]: parent[this.primaryKey],
      });

    (resolver as HasOneResolver<Child>).create = async (
      plain: PlainEntity<Child>,
    ) => {
      const {
        created: [entity],
      } = await this.childSchema
        .getDatabaseDriver()
        .createOne<Child>(this.childSchema, {
          ...plain,
          [this.foreignKey]: parent[this.primaryKey],
        });

      return entity;
    };

    (resolver as HasOneResolver<Child>).findOrDefault = async (
      defaultPlain: PlainEntity<Child>,
    ) => {
      const entity:
        | Child
        | undefined = await this.parentSchema
        .getDatabaseDriver()
        .findOne<Child>(this.childSchema, {
          [this.foreignKey]: parent[this.primaryKey],
        });

      if (entity) {
        return entity;
      }

      return this.childSchema.parse(defaultPlain);
    };

    (resolver as HasOneResolver<Child>).remove = async () =>
      this.childSchema.getDatabaseDriver().deleteOne(this.childSchema, {
        [this.foreignKey]: parent[this.primaryKey],
      });

    (resolver as HasOneResolver<Child>).update = async (
      update: EntityUpdateQuery<Child>,
    ) => {
      const {
        updated: [entity],
      } = await this.childSchema
        .getDatabaseDriver()
        .updateOne<Child>(this.childSchema, {
          where: {
            [this.foreignKey]: parent[this.primaryKey],
          },
          update,
        });

      return entity;
    };

    return resolver as HasOneResolver<Child>;
  }
}
