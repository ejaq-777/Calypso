import { Schema, model, type Document } from 'mongoose';

export interface IImageDocument extends Document {
  filename: string;
  originalName: string;
  contentType: string;
  fileSize: number;
  data: Buffer; // Stores the raw binary image file
  location?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
  };
  metadata: {
    make?: string;
    model?: string;
    dateTimeOriginal?: string;
    iso?: number;
    exposureTime?: string;
    fNumber?: number;
    [key: string]: any;
  };
  createdAt: Date;
}

const imageSchema = new Schema<IImageDocument>({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  contentType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  data: { type: Buffer, required: true }, // Binary file storage
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    altitude: { type: Number },
  },
  metadata: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ImageModel = model<IImageDocument>('ImageMetadata', imageSchema);