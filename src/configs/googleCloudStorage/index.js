import { Storage } from '@google-cloud/storage';
import fs from 'fs';

const storage = new Storage();
const bucketname = process.env.GCS_BUCKET_NAME || 'pwm-local';

async function createBucket() {
    await storage.createBucket(bucketname);
    console.log(`Bucket ${bucketname} created.`);
}

async function uploadFile(filePath, destFileName) {
    await storage
        .bucket(bucketname)
        .upload(filePath, { destination: destFileName });
}

const getStorageURL = (destFileName) =>
    `https://storage.googleapis.com/${bucketname}/${destFileName}`;
//createBucket().catch(console.error);

// TODO;
// 2. if it is working, make another fns for thumb of answer, image for questions
// 3. find image optimize app
export const uploadPsyThumbnail = async function (qId, filePath, filename) {
    const destFileName = `test/${qId}/psy/${filename}`;
    await uploadFile(filePath, destFileName);
    // delete local file
    fs.unlinkSync(filePath);
    return getStorageURL(destFileName);
};

export const uploadOGThumbnail = async function (qId, filePath, filename) {
    const destFileName = `test/${qId}/og/${filename}`;
    await uploadFile(filePath, destFileName);
    // delete local file
    fs.unlinkSync(filePath);
    return getStorageURL(destFileName);
};
