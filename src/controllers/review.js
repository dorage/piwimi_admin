import { selectReviews } from '../db/query';

export const getReviews = async (req, res) => {
    try {
        const reviews = await selectReviews(40, 0);
        console.log(reviews);
        res.render('review/list', { content: reviews });
    } catch (err) {
        console.log(err);
    }
};
