export const AVATARS_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Action: ['s3:GetBucketLocation'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: ['arn:aws:s3:::avatars'],
      Sid: '',
    },
    {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: ['arn:aws:s3:::avatars/*'],
      Sid: '',
    },
    {
      Action: ['s3:ListBucket'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: ['arn:aws:s3:::avatars'],
      Sid: '',
    },
  ],
};

export const MEDIA_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Action: ['s3:GetBucketLocation'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: ['arn:aws:s3:::media'],
      Sid: '',
    },
    {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: ['arn:aws:s3:::media/*'],
      Sid: '',
    },
    {
      Action: ['s3:ListBucket'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: ['arn:aws:s3:::media'],
      Sid: '',
    },
  ],
};

export const TEMP_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Action: ['s3:GetBucketLocation', 's3:ListBucketMultipartUploads'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: ['arn:aws:s3:::temp'],
      Sid: '',
    },
    {
      Action: ['s3:AbortMultipartUpload', 's3:DeleteObject', 's3:ListMultipartUploadParts', 's3:PutObject'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: ['arn:aws:s3:::temp/*'],
      Sid: '',
    },
  ],
};
