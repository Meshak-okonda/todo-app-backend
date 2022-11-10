import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';


const EXPIRE_TIME = process.env.SIGNED_URL_EXPIRATION;
const BUCKET_NAME = process.env.ATTACHMENT_S3_BUCKET;

const XAWS = AWSXRay.captureAWS(AWS);

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
});

export const getPresignedUrl = (imageId: string) => {
  return s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: imageId,
    Expires: EXPIRE_TIME
  });
}