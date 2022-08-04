import * as AWS from 'aws-sdk/global';

console.log('hallo');

// upload file procedure
// 1, upload to filename.ext to S3 with URL as userId/Math.rand()+filename.ext
// 2, S3 upload completes triggers lambda https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html
