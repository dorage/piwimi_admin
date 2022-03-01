import {
    insertPsy,
    selectPsyById,
    selectPsyByIdDetail,
    selectPsys,
    updateOpengraph,
    updatePsy,
} from '../db/query';
import { uploadPsyThumbnail } from '../configs/googleCloudStorage';

/**
 * GET
 * /psy
 * 심리테스트 리스트 페이지
 * @param {*} req
 * @param {*} res
 */
export const getPsychotest = async (req, res) => {
    try {
        const psys = await selectPsys(20, 0);
        res.render('psychotest/list', { content: { psys } });
    } catch (err) {
        console.log(err);
    }
};

/**
 * GET
 * /psy/create
 * 심리테스트 생성 페이지
 * @param {*} req
 * @param {*} res
 */
export const getPsychotestCreate = async (req, res) => {
    try {
        res.render('psychotest/create');
    } catch (err) {
        console.log(err);
    }
};

/**
 * POST
 * /psy/create
 * 심리테스트 생성 작업 후 redirect
 * @param {*} req
 * @param {*} res
 */
export const postPsychotestCreate = async (req, res) => {
    const { title, description } = req.body;
    try {
        const psyId = await insertPsy();
        console.log(psyId);
        const thumbnail = await uploadPsyThumbnail(psyId, req.file);
        const psy = await updatePsy(psyId, {
            title,
            description,
            thumbnail,
        });
        const { opengraphId } = psy[0];
        await updateOpengraph(opengraphId, {
            commonTitle: title,
            commonDescription: description,
            commonImage: thumbnail,
            twitterTitle: title,
            twitterDescription: description,
            twitterImage: thumbnail,
        });
        res.redirect(`/psy/${psyId}`);
    } catch (err) {
        console.log(err);
    }
};

// TODO
export const postPsychotest = async (req, res) => {
    try {
    } catch (err) {}
};

/**
 * GET
 * /psy/:psyId
 * 심리테스트 정보 페이지
 * @param {*} req
 * @param {*} res
 */
export const getPsychotestDetail = async (req, res) => {
    try {
        const { psyId } = req.params;
        const psy = (await selectPsyByIdDetail(psyId))[0];
        res.render('psychotest/detail', { content: { psy } });
    } catch (err) {
        console.log(err);
    }
};
