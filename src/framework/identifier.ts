export class Identifier<ValueType> {
  constructor(private readonly value: ValueType) {}

  public equals(id: Identifier<ValueType>): boolean {
    if (!id) {
      return false;
    }

    if (!(id instanceof Identifier)) {
      return false;
    }

    return id.value === this.value;
  }

  public getValue() {
    return this.value;
  }
}
