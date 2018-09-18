
export class Product {

  constructor(name?: string, description?: string) {

    this.name = name;
    this.description = description;
    
  }

  //get friendlyName(): string {
  //  let name = this.name || this.name;

  //  if (this.name)
  //    name = this.name + " " + name;

  //  return name;
  //}

  public id: string;
  public name: string;
  public description: string;
  public buyingPrice: string;
  public sellingPrice: string;
  public oldPrice: string;
  public unitsInStock: number;
  public isActive: boolean;
  public isDiscontinued: boolean;
  public isPromote: boolean;
  public isHot: boolean;
  public gallery: string;
  public productCode: string;
  public content: string;
  public productCategoryId: number;
  public icon: string;
  public releaseDate: Date;
}
