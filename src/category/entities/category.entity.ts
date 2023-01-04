import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document {
    @Prop({
        unique: true,
        required: true,
        index: true
    })
    name: string;

    @Prop({
        default: true
    })
    status: boolean;
}

export const CategorySchema = SchemaFactory.createForClass( Category );
