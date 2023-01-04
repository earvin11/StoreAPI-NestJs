import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { isValidObjectId, Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';


@Injectable()
export class ProductService {

  constructor(
    @InjectModel( Product.name )
    private readonly productModel: Model<Product>

  ) {}

  async create(createProductDto: CreateProductDto) {

    createProductDto.name = createProductDto.name.toLowerCase();

    try {
      const product = await this.productModel.create( createProductDto )
      return product;
    } catch (error) {
      console.log(error);
      this.handleExceptions(error);
    }
  }

  async findAll() {

    try {
      const products = await this.productModel.find();
      return products
      
    } catch (error) {
      console.log(error);
      this.handleExceptions(error);
    }
  }

  async findOne(term: string) {

    let product: Product

    if(isValidObjectId(term)) {
      product = await this.productModel.findById(term)
    }

    if(!product) {
      product = await this.productModel.findOne({ name: term.toLowerCase().trim() });
    }

    if(!product) {
      throw new NotFoundException(`Product with id or name ${ term } not found`);
    }

    return product
  }

  async update(term: string, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto)
    const product = await this.findOne( term );

    if(updateProductDto.name) {
      updateProductDto.name = updateProductDto.name.toLowerCase();
    }

    try {
      await product.updateOne( updateProductDto, { new: true } );
      return { ...product.toJSON(), ...updateProductDto }
    } catch (error) {
      console.log(error);
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.productModel.deleteOne({ _id: id });

    if(deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${ id }" not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't update Pokemon - Check server logs`);
  }
}
