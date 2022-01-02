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

const main = async () => {
    const psyId = await insertPsy();
    const psyObj = {
        title: 'test!',
        thumbnail: 'test.piwimi.com:test.jpg',
        isOpend: 'true',
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
    console.log(await selectPsyById(psyId)[0]);
    console.log('UPDATE');
    console.log(await updatePsy(psyId, psyObj));

    const resultId = await insertResult();
    const resultObj = {
        thumbnail: 'testResult!',
        result: 'Moron',
        description: 'test.piwimi.com:result.jpg',
    };
    console.log('resultId', resultId);
    console.log('SELECT');
    console.log(await selectResultById(resultId)[0]);
    console.log('UPDATE');
    console.log(await updateResult(resultId, resultObj));

    const reviewId = await insertReview(psyId, 'test review');
    console.log('reviewId', reviewId);
    console.log('SELECT');
    console.log(selectReviews(1)[0]);

    // DELETE ALL
    await deletePsy(psyId);
    await deleteResult(resultId);
};

main();
