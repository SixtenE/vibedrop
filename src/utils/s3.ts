import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

const client = new S3Client({
  forcePathStyle: true,
  region: import.meta.env.VITE_S3_REGION,
  endpoint: import.meta.env.VITE_S3_ENDPOINT,
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
  },
});

export async function main(file: File) {
  const objectCommand = new PutObjectCommand({
    Bucket: "vibe",
    Key: nanoid(),
    Body: file,
    ContentType: file.type,
  });

  try {
    const data = await client.send(objectCommand);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
