import AWS from 'aws-sdk';
import awsConfig from '../aws-config';

AWS.config.update({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
});

const s3 = new AWS.S3();

export const uploadFileToS3 = (file) => {
  const params = {
    Bucket: awsConfig.bucketName,
    Key: file.name,
    Body: file,
    ContentType: file.type,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};


export const convertMP3Name = (MP3Name, selectedLanguage) => {

  const extension = MP3Name.slice((MP3Name.lastIndexOf(".") - 1 >>> 0) + 2);
  const nameWithoutExtension = MP3Name.substring(0, MP3Name.lastIndexOf('.')) || MP3Name;
  // Step 1: Replace all spaces with underscores
  let cleanedString = nameWithoutExtension.replace(/ /g, '_');
  // Step 2: Remove all special characters, including periods
  cleanedString = cleanedString.replace(/[^a-zA-Z0-9_]/g, '');

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const final = `${cleanedString}_${day}_${month}_${year}_${hours}_${minutes}_${selectedLanguage}.${extension}`;

  return final;
};


export const convertInsightsOrOutputJsonName = (filetype, MP3Name) => {

  // Replace .mp3 with .json and add insights_ or output_ to the beginning
  const formattedName = `${filetype}_${MP3Name.replace(/\.(mp3|m4a|flv)$/, '.json')}`;

  return formattedName;
};




