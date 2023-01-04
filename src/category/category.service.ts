import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {

  constructor(
    @InjectModel( Category.name )
    private readonly categoryModel: Model<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {

    createCategoryDto.name = createCategoryDto.name.toLowerCase();

    try {
      const category = await this.categoryModel.create( createCategoryDto );
      return category
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryModel.find();
      return categories;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findOne(term: string) {
      let category: Category;

      if(isValidObjectId(term)) {
        category = await this.categoryModel.findById(term);
      }

      if(!category) {
        category = await this.categoryModel.findOne({ name: term.toLowerCase().trim() });
      }

      if(!category) {
        throw new NotFoundException(`Category with name or id ${term} not found`)
      }

      return category;   
  }

  async update(term: string, updateCategoryDto: UpdateCategoryDto) {
    const category: Category = await this.findOne(term);

    if(updateCategoryDto.name) {
      updateCategoryDto.name = updateCategoryDto.name.toLowerCase();
    }

    try {

      await category.updateOne( updateCategoryDto, { new: true } )
      
    } catch (error) {
      console.log(error);
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.categoryModel.deleteOne({ _id: id });

    if(deletedCount === 0) {
      throw new BadRequestException(`Category with id "${ id }" not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if(error.code === 11000) {
      throw new BadRequestException(`Category exists in db ${ JSON.stringify( error.keyValue ) }`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Check server logs`);
  }
}
