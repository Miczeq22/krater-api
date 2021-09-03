import { ValueObject } from '@root/framework/ddd-building-blocks/value-object';
import { CatalogueFilterNotSupportedError } from '../../../errors/catalogue-filter-not-supported.error';

export enum CatalogueFilterValue {
  Newest = 'Newest',
  Active = 'Active',
  Favourite = 'Favourite',
}

interface CatalogueFilterProps {
  value: string;
}

export class CatalogueFilter extends ValueObject<CatalogueFilterProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static Newest = new CatalogueFilter(CatalogueFilterValue.Newest);

  public static Active = new CatalogueFilter(CatalogueFilterValue.Active);

  public static Favourite = new CatalogueFilter(CatalogueFilterValue.Favourite);

  public static fromValue(value: string) {
    switch (value) {
      case CatalogueFilterValue.Newest:
        return this.Newest;

      case CatalogueFilterValue.Active:
        return this.Active;

      case CatalogueFilterValue.Favourite:
        return this.Favourite;

      default:
        throw new CatalogueFilterNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
