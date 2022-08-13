import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/data-seed';



@Injectable()
export class SeedService {

  constructor(
    private readonly producService: ProductsService
  ){}


  async runSeed() {
    await this.insertNewProducts();
    return 'SEED EXECUTED';
  }

  private async insertNewProducts(){

    await this.producService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push( this.producService.create( product ) );
    })

    await Promise.all( insertPromises );

    return true;

  }

  
}
