export const avatarsPolicy = (bucket: string) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Action: ['s3:GetBucketLocation'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}`],
      Sid: '',
    },
    {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}/*`],
      Sid: '',
    },
    {
      Action: ['s3:ListBucket'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}`],
      Sid: '',
    },
  ],
});

export const bannersPolicy = (bucket: string) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Action: ['s3:GetBucketLocation'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}`],
      Sid: '',
    },
    {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}/*`],
      Sid: '',
    },
    {
      Action: ['s3:ListBucket'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}`],
      Sid: '',
    },
  ],
});

export const coversPolicy = (bucket: string) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Action: ['s3:GetBucketLocation'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}`],
      Sid: '',
    },
    {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}/*`],
      Sid: '',
    },
    {
      Action: ['s3:ListBucket'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}`],
      Sid: '',
    },
  ],
});

export const mediaPolicy = (bucket: string) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Action: ['s3:GetBucketLocation'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}`],
      Sid: '',
    },
    {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}/*`],
      Sid: '',
    },
    {
      Action: ['s3:ListBucket'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}`],
      Sid: '',
    },
  ],
});

export const tempPolicy = (bucket: string) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Action: ['s3:GetBucketLocation', 's3:ListBucketMultipartUploads'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}`],
      Sid: '',
    },
    {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}/*`],
      Sid: '',
    },
    {
      Action: [
        's3:AbortMultipartUpload',
        's3:DeleteObject',
        's3:ListMultipartUploadParts',
        's3:PutObject',
      ],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${bucket}/*`],
      Sid: '',
    },
  ],
});
