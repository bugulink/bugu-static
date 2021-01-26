module.exports = {
  region: process.env.BUGU_STATIC_REGION || 'qn:cn-south-1',
  bucket: process.env.BUGU_STATIC_BUCKET,
  accessKey: process.env.BUGU_STATIC_ACCESS_KEY,
  secretKey: process.env.BUGU_STATIC_SECRET_KEY
};
