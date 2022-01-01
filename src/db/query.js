import pool from '.';
import { snakeToCamel, updateOpengraph } from './utils';

const QUERY = async (query) => {
    const { rows } = await pool.query(query);
    return rows.map(snakeToCamel);
};

/*--------------------------------------------------------

TRANSACTION

--------------------------------------------------------*/

const transactionBegin = () => pool.query('BEGIN');

const transactionSavepoint = (name) => pool.query(`SAVEPOINT ${name}`);

const transactionRollback = (name) => {
    if (name) {
        return pool.query(`ROLLBACK TO ${name}`);
    }
    return pool.query('ROLLBACK');
};

const transactionCommit = () => pool.query('COMMIT');

/*--------------------------------------------------------

SELECT

--------------------------------------------------------*/

/**
 * review를 가져옵니다
 * @returns
 */
// TODO:
export const selectReviews = async (limit = 20, offset = 0) => {
    const queryString = `
        SELECT *
        FROM psy_review
        ORDER BY review_id DESC
        LIMIT ${limit}
        OFFSET ${offset}
   `;
    return QUERY(queryString);
};

/**
 * 최신 psy순으로 psy를 가져옵니다
 * @returns
 */
// TODO:
export const selectPsys = async (limit = 20, offset = 0) => {
    const queryString = `
        SELECT *
        FROM admin.psy
        ORDER BY psy_id DESC
        LIMIT ${limit}
        OFFSET ${offset}
   `;
    return QUERY(queryString);
};

/**
 * 최신 psy순으로 psy를 가져옵니다
 * @returns
 */
// TODO:
export const selectPsyResult = async (limit = 20, offset = 0) => {
    const queryString = `
        SELECT *
        FROM admin.psy
        ORDER BY psy_id DESC
        LIMIT ${limit}
        OFFSET ${offset}
   `;
    return QUERY(queryString);
};

/**
 * best 심리테스트를 플레이된 횟수와 함께 가져옵니다
 * @returns
 */
// TODO:
export const selectBestWithView = async () => {
    const queryString = `
        SELECT *
        FROM (
            SELECT *
            FROM admin.psy
            WHERE psy_id = (SELECT best FROM admin.psy_best)
        ) AS best_psy, (
            select psy_id, sum(view) AS view
            FROM (
                SELECT psy_id, unnest(views) AS view
                FROM psy_view
                WHERE psy_id = (SELECT best FROM admin.psy_best)
            ) as view_table
            GROUP BY psy_id
        ) AS best_view
   `;
    return QUERY(queryString);
};

/**
 * 심리테스트를 최신순으로 limit개수만큼 플레이된 횟수와 함게 가져옵니다
 * @param {*} limit default 10
 * @returns
 */
// TODO:
export const selectPsyWithView = async (limit = 10, offset = 0) => {
    const queryString = `
        SELECT *
        FROM (
            SELECT *
            FROM admin.psy
            LIMIT 10
            OFFSET ${offset}
        ) AS psy_table
        JOIN (
            SELECT psy_id, sum(view) AS view
            FROM
            (
                SELECT psy_table.psy_id, unnest(views) AS view
                FROM (
                    SELECT *
                    FROM admin.psy
                    LIMIT 10
                    ${offset}
                ) as psy_table,
                psy_view
                WHERE psy_table.psy_id = psy_view.psy_id
            ) AS view_table
            GROUP BY psy_id
        ) AS view_table
        ON psy_table.psy_id = view_table.psy_id
        ORDER BY psy_table.psy_id DESC;
    `;
    return QUERY(queryString);
};

/**
 * id로 심리테스트를 가져옵니다.
 * @param {*} qId
 * @returns
 */
export const selectPsyById = async (psyId) => {
    const queryString = `
        SELECT *
        FROM admin.psy
        WHERE psy_id=${psyId}
    `;
    return await QUERY(queryString);
};

/**
 * id로 심리테스트 결과를 가져옵니다.
 * @param {*} psyId
 * @returns
 */
export const selectPsyResultById = async (resultId) => {
    const queryString = `
        SELECT *
        FROM admin.psy_result
        WHERE id=${resultId}
    `;
    return await QUERY(queryString);
};

/**
 * id로 심리테스트의 결과를 가져옵니다.
 * @param {*} qId
 * @param {*} aId
 * @returns
 */
// TODO:
export const selectResultByIdWithView = async (qId) => {
    const queryString = `
        SELECT admin.psy_result.psy_id, answers, views, opengraphs
        FROM admin.psy_result, psy_view
        WHERE admin.psy_result.psy_id=${qId} AND admin.psy_result.psy_id=psy_view.psy_id
    `;
    return (await QUERY(queryString))[0];
};

// piwimi.id/{psyId}/result/{resultId}

/*--------------------------------------------------------

UPDATE

--------------------------------------------------------*/

/**
 * View를 1증가시킵니다.
 * @param {*} viewId
 * @returns
 */
const updateView = (viewId) =>
    QUERY(`
        UPDATE psy_view
        SET views = views + 1
        WHERE id = ${viewId}
`);

/**
 * view Id를 찾아내어 view를 1씩 증가시킵니다.
 * @param {*} psyId
 * @param {*} resultId
 * @returns
 */
export const updateCountUpView = async (psyId, resultId) => {
    await transactionBegin();
    // psy의 전체 view
    await updateView((await selectPsyById(psyId)).shift().psyViewId);
    // psy_result의 view
    await updateView((await selectPsyResultById(resultId)).shift().psyViewId);
    await transactionCommit();
    return true;
};

// TODO:
export const updatePsy = async (psyId, { title, description, imgUrl }) => {
    const queryString = `
        UPDATE admin.psy
        SET
            title = '${title}',
            description='${description}',
            img_url='${imgUrl}'
        WHERE
            psy_id=${psyId}
        RETURNING *
    `;
    return QUERY(queryString);
};

// TODO:
export const updateResult = async () => {};

// TODO:
export const updateOpengraph = async (psyId, changedOpengraph) => {
    const { opengraph } = await selectPsyById(psyId);
    const newOpengraph = updateOpengraph(opengraph, changedOpengraph);

    const queryString = `
        UPDATE admin.psy
        SET
            opengraph='${JSON.stringify(newOpengraph)}'
        WHERE
            psy_id=${psyId};
        RETURNING *
    `;
    return QUERY(queryString);
};

/*--------------------------------------------------------

INSERT

--------------------------------------------------------*/

/**
 * 새로운 psy_view를 생성하고 id를 반환합니다.
 * @returns Number : id of inserted psy_view
 */
const insertView = async () => {
    const queryString = `
        INSERT INTO psy_view
        (
            views
        )
        VALUES
        (
            0
        )
        RETURNING id;
    `;
    return QUERY(queryString)[0].id;
};

/**
 * 새로운 psy_review를 생성하고 id를 반환합니다.
 * @param {*} qId
 * @param {*} review
 * @returns Number : id of inserted psy_reivew
 */
export const insertReview = async (qId, review) => {
    const queryString = `
        INSERT INTO psy_review
        (
            review
        )
        VALUES
        (
            ${qId},
            ${review}
        )
        RETURNING id;
    `;
    return QUERY(queryString)[0].id;
};

/**
 * 새로운 opengraph를 생성하고 id를 반환합니다.
 * @returns Number : id of inserted psy_reivew
 */
const insertOpengraph = async () => {
    const queryString = `
        INSERT INTO admin.psy_result
        (
            common_url,
            common_title,
            common_description,
            common_image,
            common_image_alt,
            twitter_url,
            twitter_title,
            twitter_description,
            twitter_image,
            twitter_hashtag
        )
        VALUES
        (
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        )
        RETURNING id;
    `;
    return QUERY(queryString)[0].id;
};

/**
 * 새로운 psy를 생성하고 id를 반환합니다.
 * @returns Number : id of inserted psy
 */
export const insertPsy = async () => {
    await transactionBegin();
    const ogId = await insertOpengraph();
    const viewId = await insertView();

    const queryString = `
        INSERT INTO admin.psy
        (
            title,
            description,
            thumbnail,
            is_opend,
            questions,
            opengraph_id,
            psy_view_id
        ) VALUES
        (
            '',
            '',
            '',
            false,
            [],
            ${ogId},
            ${viewId}
        )
        RETURNING id;
    `;

    const id = await QUERY(queryString)[0];
    await transactionCommit();
    return id;
};

/**
 * 새로운 psy_result를 생성하고 id를 반환합니다.
 * @param {*} psyId
 * @returns Number : id of inserted psy_result
 */
const insertResult = async (psyId) => {
    await transactionBegin();
    const ogId = await insertOpengraph();
    const viewId = await insertView();

    const queryString = `
        INSERT INTO admin.psy_result
        (
            psy_id,
            thumbnail,
            result,
            description,
            opengraph_id,
            psy_view_id
        )
        VALUES
        (
            ${psyId},
            '',
            '',
            '',
            ${ogId},
            ${viewId}
        )
        RETURNING id;
    `;
    const id = await QUERY(queryString)[0];
    await transactionCommit();
    return id;
};
