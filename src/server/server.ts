import express, { type Request, type Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import { exiftool } from 'exiftool-vendored';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { ImageModel } from './models/Image';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calypso';

// Middleware
app.use(express.json());
app.use(cors());

// Use memory storage so we have access to req.file.buffer
const upload = multer({ storage: multer.memoryStorage() });

// Connect to Local MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`[Calypso Server] Connected to local MongoDB at ${MONGO_URI}`))
  .catch((err) => console.error('[Calypso Server] MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`[Calypso Server] Running on http://localhost:${PORT}`);
});

app.post('/api/images/upload', upload.single('image'), async (req: Request, res: Response) => {
  let tempFilePath: string | null = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    // Write the memory buffer to a temporary file so exiftool can read it
    tempFilePath = path.join(os.tmpdir(), `calypso-temp-${Date.now()}-${req.file.originalname}`);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // Extract metadata using exiftool-vendored
    const tags = await exiftool.read(tempFilePath);

    // Immediately clean up the temporary file
    fs.unlinkSync(tempFilePath);
    tempFilePath = null;

    // Parse location data if GPS tags exist
    let locationData = undefined;
    if (tags.GPSLatitude && tags.GPSLongitude) {
      locationData = {
        latitude: tags.GPSLatitude,
        longitude: tags.GPSLongitude,
        altitude: typeof tags.GPSAltitude === 'number' ? tags.GPSAltitude : undefined,
      };
    }

    // Construct and save the document containing BOTH the binary buffer and metadata
    const newImageRecord = new ImageModel({
      filename: `${Date.now()}-${req.file.originalname}`,
      originalName: req.file.originalname,
      contentType: req.file.mimetype,
      fileSize: req.file.size,
      data: req.file.buffer, // Saves the actual image file inside MongoDB for future processing
      location: locationData,
      metadata: {
        make: tags.Make,
        model: tags.Model,
        dateTimeOriginal: tags.DateTimeOriginal,
        iso: tags.ISO,
        exposureTime: tags.ExposureTime,
        fNumber: tags.FNumber,
        ...tags,
      },
    });

    await newImageRecord.save();

    res.status(201).json({
      message: 'Image binary and metadata successfully stored in MongoDB!',
      id: newImageRecord._id,
      originalName: newImageRecord.originalName,
      size: newImageRecord.fileSize,
      location: locationData,
    });
  } catch (error) {
    // Ensure temp file cleanup happens even if an error occurs mid-process
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath); } catch {}
    }
    console.error('Error processing and saving image:', error);
    res.status(500).json({ error: 'Failed to process and store image in database.' });
  }
});

app.get('/api/images/file/:id', async (req: Request, res: Response) => {
  try {
    const imageDoc = await ImageModel.findById(req.params.id);
    if (!imageDoc) {
      return res.status(404).json({ error: 'Image not found in database.' });
    }

    res.setHeader('Content-Type', imageDoc.contentType);
    res.send(imageDoc.data);
  } catch (error) {
    console.error('Error retrieving image binary:', error);
    res.status(500).json({ error: 'Failed to retrieve image.' });
  }
});