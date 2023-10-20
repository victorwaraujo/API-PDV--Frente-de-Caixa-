import dotenv from 'dotenv'
dotenv.config()
import aws from 'aws-sdk'
const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.APPLICATION_KEY,
  },
})

export const uploadPicture = async (path, buffer, mimetype) => {
  const picture = await s3
    .upload({
      Bucket: process.env.BACKBLAZE_BUCKET,
      Key: path,
      Body: buffer,
      ContentType: mimetype,
    })
    .promise()

  return {
    url: picture.Location,
    path: picture.Key,
  }
}

export const deletePicture = async (folderPath) => {
  const fileFound = await s3
    .listObjects({
      Bucket: process.env.BACKBLAZE_BUCKET,
      Prefix: folderPath,
    })
    .promise()

  const filePath = fileFound.Contents[0].Key

  await s3
    .deleteObject({
      Bucket: process.env.BACKBLAZE_BUCKET,
      Key: filePath,
    })
    .promise()
}
