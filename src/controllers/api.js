import {
    uploadOGThumbnail,
    uploadPsyThumbnail,
} from '../configs/googleCloudStorage';
import { updatePsyInfo, updatePsyOpengraph } from '../db/query';

export const putPsyInfo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { psyId } = req.params;
        const imgUrl = req.file
            ? await uploadPsyThumbnail(psyId, req.file)
            : req.body.thumbnail;
        console.log(imgUrl);
        await updatePsyInfo(psyId, { title, description, imgUrl });
        res.send('done!');
    } catch (err) {
        console.log(err);
        res.send('failed!');
    }
};

export const putPsyOG = async (req, res) => {
    try {
        const {
            ogTitle,
            ogDescription,
            ogImageAlt,
            twtTitle,
            twtDescription,
            twtHashtags,
        } = req.body;
        const { psyId } = req.params;
        console.log(req.body);

        const opengraph = {
            og: {
                title: ogTitle,
                description: ogDescription,
                image: ogThumbnail,
                imageAlt: ogImageAlt,
            },
            twitter: {
                title: twtTitle,
                description: twtDescription,
                image: twtThumbnail,
                hashtag: twtHashtags,
            },
        };

        await updatePsyOpengraph(psyId, opengraph);
        res.send('Done!');
    } catch (err) {
        console.log(err);
        res.send('failed!');
    }
};
