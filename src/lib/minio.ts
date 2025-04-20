import { Client } from 'minio';

// Initialize MinIO client
export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

// Default bucket name
export const defaultBucket = process.env.MINIO_BUCKET || 'urbanwood';

// Initialize bucket if it doesn't exist
export async function initBucket() {
  const bucketExists = await minioClient.bucketExists(defaultBucket);
  if (!bucketExists) {
    await minioClient.makeBucket(defaultBucket, 'us-east-1');
    
    // Set bucket policy to make objects public
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${defaultBucket}/*`]
        }
      ]
    };
    
    await minioClient.setBucketPolicy(defaultBucket, JSON.stringify(policy));
  }
}

// Function to upload a file to MinIO
export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    await initBucket();
    
    // Upload the file to MinIO
    await minioClient.putObject(
      defaultBucket,
      fileName,
      file,
      file.length,
      { 'Content-Type': contentType }
    );
    
    // Get the public URL
    const publicUrl = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${
      process.env.MINIO_ENDPOINT
    }:${process.env.MINIO_PORT}/${defaultBucket}/${fileName}`;
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to MinIO:', error);
    throw error;
  }
}

// Function to delete a file from MinIO
export async function deleteFile(fileName: string): Promise<void> {
  try {
    await minioClient.removeObject(defaultBucket, fileName);
  } catch (error) {
    console.error('Error deleting file from MinIO:', error);
    throw error;
  }
}

// Extract filename from a MinIO URL
export function getFileNameFromUrl(url: string): string {
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/');
  return pathParts[pathParts.length - 1];
}