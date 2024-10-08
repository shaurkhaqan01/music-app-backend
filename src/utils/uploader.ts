import { UnprocessableEntityException } from '@nestjs/common';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import {v4 as uuid} from 'uuid';

// import { S3 } from 'aws-sdk';

export class Uploader {
  private static instance: Uploader = null;
  private S3: S3 = null;
  private constructor() {
    this.S3 = new S3({
      // endpoint: process.env.SPACE_END_POINT,
      region: process.env.AWS_S3_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_BUCKET_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_BUCKET_SECRET_ACCESS_KEY,
      },
    });
  }

  public async uploadFile(file: Express.Multer.File) {
    let fileKey = `attachment/${uuid()}`+file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const BUCKET_PARAMS = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    //@ts-ignore
    const data = await this.S3.send(new PutObjectCommand(BUCKET_PARAMS));
    
    if (data.$metadata.httpStatusCode === 200) {
      return `${process.env.SPACE_BASE_URL}/${fileKey}`;
    }
    throw new UnprocessableEntityException({
      status: 'Fail',
      data: {},
      statusCode:422,
      message:'File uploading failed.'

    });
  }
  public static getInstance(): Uploader {
    if (Uploader.instance === null) {
      Uploader.instance = new Uploader();
    }
    return Uploader.instance;
  }
}
