const awsConfig = {
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_REGION,
  bucketName: process.env.REACT_APP_BUCKET_NAME
};

export default awsConfig;