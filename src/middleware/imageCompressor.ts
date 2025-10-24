import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import { GenericError } from './errorHandler/errorTypes';

export const imageCompressor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files) return next();

    const files = req.files as Express.Multer.File[];
    const targetSize = 100 * 1024; // 100 KB
    const compressedFiles: Express.Multer.File[] = [];

    for (const file of files) {
    //   console.log(`\n Compressing "${file.originalname}"`);
    //   console.log(`   Original size: ${(file.size / 1024).toFixed(2)} KB`);

      // Skip compression if already under target size
      if (file.size <= targetSize) {
        // console.log(`   Skipping compression, already below target (${(file.size / 1024).toFixed(2)} KB)`);
        compressedFiles.push(file);
        continue;
      }

      // Faster reduction if image > 2 MB
      const originalSize = file.size;
      let step = originalSize > 2 * 1024 * 1024 ? 30 : 10;

      let quality = 90;
      let compressedBuffer = await sharp(file.buffer).jpeg({ quality }).toBuffer();

    //   console.log(
    //     `   → Attempt with quality ${quality}: ${(compressedBuffer.length / 1024).toFixed(2)} KB`
    //   );

      // Gradually reduce quality until under 100 KB or quality too low
      while (compressedBuffer.length > targetSize && quality > 10) {
        quality -= step;
        if (quality < 10) quality = 10;

        compressedBuffer = await sharp(file.buffer).jpeg({ quality }).toBuffer();
        // console.log(
        //   `   → Recompress (quality ${quality}): ${(compressedBuffer.length / 1024).toFixed(2)} KB`
        // );
      }

      // Fallback: slight resize if still over 100 KB
      if (compressedBuffer.length > targetSize) {
        // console.log(
        //   `   Still too large (${(compressedBuffer.length / 1024).toFixed(
        //     2
        //   )} KB). Applying gentle resize...`
        // );
        const reductionRatio = Math.sqrt(targetSize / compressedBuffer.length);
        const metadata = await sharp(file.buffer).metadata();

        if (metadata.width && metadata.height) {
          compressedBuffer = await sharp(file.buffer)
            .resize({
              width: Math.round(metadata.width * reductionRatio),
              height: Math.round(metadata.height * reductionRatio),
            })
            .jpeg({ quality })
            .toBuffer();
        }
      }

    //   console.log(`Final size: ${(compressedBuffer.length / 1024).toFixed(2)} KB\n`);

      compressedFiles.push({
        ...file,
        buffer: compressedBuffer,
        size: compressedBuffer.length,
        mimetype: 'image/jpeg',
        originalname: file.originalname.replace(/\.[^/.]+$/, '.jpg'),
      });
    }

    (req.files as Express.Multer.File[]) = compressedFiles;
    next();
  } catch (err) {
    console.error(' Image compression error:', err);
    throw new GenericError('Image compression failed')
  }
};
