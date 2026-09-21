import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const bucket = process.env.STORAGE_BUCKET;

export async function getSignedUploadUrl(key: string, contentType = 'application/octet-stream', expiresInSeconds = 900) {
  if (!bucket) throw new Error('STORAGE_BUCKET not configured');
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const url = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  return url;
}

export function storageMeta(key: string, filename: string, mimetype?: string, size?: number, organizationId?: string, uploadedBy?: string) {
  return {
    url: `https://${bucket}.s3.amazonaws.com/${key}`,
    filename,
    mimetype,
    size,
    organizationId,
    uploadedBy,
  };
}
