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
export const uploadPsyThumbnail = async function (psyId, file) {
    const { path } = file;
    const destFileName = `test/${psyId}/psy/`;

    await uploadFile(path, destFileName);
    // delete local file
    fs.unlinkSync(path);
    return getStorageURL(destFileName);
};

export const uploadOGThumbnail = async function (psyId, file) {
    const { path } = file;
    const destFileName = `test/${psyId}/og/`;
    await uploadFile(path, destFileName);
    // delete local file
    fs.unlinkSync(path);
    return getStorageURL(destFileName);
};
