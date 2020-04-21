export class EntityID {
  constructor(private origin: string | number) {}

  toString(): string {
    return `EntityId:${this.origin}`;
  }

  static from(serialized: string): EntityID {
    let origin: string | number = serialized.replace(
      /^EntityId:([\w\d]+)$/,
      '$1',
    );

    if (!origin) {
      throw new Error('Unprocessable EntityID serialized data');
    }

    if (!isNaN(+origin)) {
      origin = +origin;
    }

    return new EntityID(origin);
  }
}
