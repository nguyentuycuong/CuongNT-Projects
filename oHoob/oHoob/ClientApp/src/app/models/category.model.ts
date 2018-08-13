
export class Category {

  constructor(name?: string, description?: string, order?: string) {

    this.name = name;
    this.description = description;
    this.order = order;
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
  public order: string;
  public isActive: boolean;
  public appName: string;
  public userId: string;
  public categoryParent: number;
  
}
