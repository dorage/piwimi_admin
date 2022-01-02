import {
    insertPsy,
    insertResult,
    insertReview,
    selectPsyById,
    selectReviews,
    selectResultById,
    updatePsy,
    updateOpengraph,
    updateCountUpView,
    updateResult,
    deletePsy,
    deleteResult,
} from '../src/db/query';

const LINEBREAK = () => {
    console.log('');
    console.log('────────────────────────────────────');
    console.log('');
};

const main = async () => {
    try {
        const psyId = await insertPsy();
        const psyObj = {
            title: 'test!',
            thumbnail: 'test.piwimi.com:test.jpg',
            isOpened: true,
            questions: [
                {
                    question: 'none1',
                    thumbnail: 'test.piwimi.com:question1.jpg',
                },
                {
                    question: 'none2',
                    thumbnail: 'test.piwimi.com:question2.jpg',
                },
            ],
        };
        console.log('psyId', psyId);
        console.log('SELECT');
        console.log(await selectPsyById(psyId));
        console.log('UPDATE');
        console.log(await updatePsy(psyId, psyObj));

        LINEBREAK();

        const resultId = await insertResult(psyId);
        const resultObj = {
            thumbnail: 'test.piwimi.com:test.jpg',
            result: 'Moron',
            description: 'test.piwimi.com:result.jpg',
        };
        console.log('resultId', resultId);
        console.log('SELECT');
        console.log(await selectResultById(resultId));
        console.log('UPDATE');
        console.log(await updateResult(resultId, resultObj));

        LINEBREAK();

        const reviewId = await insertReview(psyId, 'test review');
        console.log('reviewId', reviewId);
        console.log('SELECT');
        console.log(await selectReviews(1));

        LINEBREAK();

        // DELETE ALL
        await deleteResult(resultId);
        console.log('DELETED psy_result');
        await deletePsy(psyId);
        console.log('DELETED psy');
    } catch (err) {
        console.log(err);
    }
};

export default main;
