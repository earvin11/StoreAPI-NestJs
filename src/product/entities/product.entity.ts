import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose/dist';
import mongoose, { Document } from 'mongoose';
import { Category } from '../../category/entities/category.entity';

@Schema()
export class Product extends Document {

    @Prop({
        unique: true,
        index: true
    })
    name: string;

    @Prop()
    price: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    category: Category

    @Prop({ default: true })
    status: boolean;

    @Prop()
    description: string;

    @Prop({ default: true })
    available: boolean;

    @Prop()
    img: string;

}


export const ProductSchema = SchemaFactory.createForClass( Product );
