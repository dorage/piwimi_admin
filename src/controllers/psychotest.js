import { selectAnswerByPsyId, selectPsyById, selectPsys } from '../db/query';

export const getPsychotest = async (req, res) => {
    try {
        const psys = await selectPsys(20, 0);
        res.render('psychotest/list', { content: { psys } });
    } catch (err) {
        console.log(err);
    }
};

export const getPsychotestCreate = async (req, res) => {
    try {
        res.render('psychotest/create');
    } catch (err) {
        console.log(err);
    }
};

export const postPsychotest = async (req, res) => {
    try {
    } catch (err) {}
};

export const getPsychotestDetail = async (req, res) => {
    try {
        const { qId } = req.params;
        const psy = await selectPsyById(qId);
        const answer = await selectAnswerByPsyId(qId);
        res.render('psychotest/detail', { content: { psy, answer } });
    } catch (err) {
        console.log(err);
    }
};
