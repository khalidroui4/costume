import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICostume extends Document {
  name: string;
  description: string;
  type: 'sale' | 'rent';
  price: number;
  rentPrice?: number;
  size: string[];
  color: string[];
  images: string[];
  jacket: {
    size: string;
    color: string;
    material: string;
  };
  pants: {
    size: string;
    color: string;
    material: string;
  };
  shirt: {
    size: string;
    color: string;
    material: string;
  };
  tie: {
    color: string;
    material: string;
  };
  belt: {
    size: string;
    color: string;
    material: string;
  };
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CostumeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['sale', 'rent'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rentPrice: {
      type: Number,
      required: function (this: ICostume) {
        return this.type === 'rent';
      },
    },
    size: {
      type: [String],
      required: true,
    },
    color: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    jacket: {
      size: { type: String, required: true },
      color: { type: String, required: true },
      material: { type: String, required: true },
    },
    pants: {
      size: { type: String, required: true },
      color: { type: String, required: true },
      material: { type: String, required: true },
    },
    shirt: {
      size: { type: String, required: true },
      color: { type: String, required: true },
      material: { type: String, required: true },
    },
    tie: {
      color: { type: String, required: true },
      material: { type: String, required: true },
    },
    belt: {
      size: { type: String, required: true },
      color: { type: String, required: true },
      material: { type: String, required: true },
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Costume: Model<ICostume> = mongoose.models.Costume || mongoose.model<ICostume>('Costume', CostumeSchema);

export default Costume;

