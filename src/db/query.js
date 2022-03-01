import pool from '.';
import { camelToSnake, snakeToCamel, updateSetQuery } from './utils';

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
export const selectReviews = async (limit = 20, offset = 0) => {
    const queryString = `
        SELECT *
        FROM psy_review
        ORDER BY id DESC
        LIMIT ${limit}
        OFFSET ${offset}
   `;
    return QUERY(queryString);
};

/**
 * 최신 psy순으로 psy를 가져옵니다
 * @returns
 */
export const selectPsys = async (limit = 20, offset = 0) => {
    const queryString = `
        SELECT *
        FROM admin.psy
        ORDER BY id DESC
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
 * @param {*} psyId
 * @returns
 */
export const selectPsyById = async (psyId) => {
    const queryString = `
        SELECT *
        FROM admin.psy
        WHERE id=${psyId}
    `;
    return QUERY(queryString);
};
/**
 * id로 심리테스트를 오픈그래프 정보와 함게 가져옵니다.
 * @param {*} psyId
 * @returns
 */
export const selectPsyByIdWithOpengraph = async (psyId) => {
    const queryString = `
        SELECT *
        FROM
            admin.psy
        JOIN (
            SELECT *
            FROM admin.opengraph
            WHERE id = (
                SELECT opengraph_id
                FROM admin.psy
                WHERE id=${psyId}
            )
        ) as opengraph
        ON admin.psy.opengraph_id = opengraph.id
    `;
    return QUERY(queryString);
};
/**
 * id로 심리테스트를 오픈그래프, 뷰 등 모든 정보와 함게 가져옵니다.
 * @param {*} psyId
 * @returns
 */
export const selectPsyByIdDetail = async (psyId) => {
    const queryString = `
        SELECT *
        FROM (
            SELECT *
            FROM
                admin.psy
            JOIN (
                SELECT *
                FROM admin.opengraph
                WHERE id = (
                    SELECT opengraph_id
                    FROM admin.psy
                    WHERE id=${psyId}
                )
            ) as opengraph
            ON admin.psy.opengraph_id = opengraph.id
        ) as psy
        JOIN (
            SELECT *
            FROM psy_view
        ) as psy_view
        ON psy.psy_view_id = psy_view.id
    `;
    return QUERY(queryString);
};

/**
 * id로 심리테스트 결과를 가져옵니다.
 * @param {*} psyId
 * @returns
 */
export const selectResultById = async (resultId) => {
    const queryString = `
        SELECT *
        FROM admin.psy_result
        WHERE id=${resultId}
    `;
    return await QUERY(queryString);
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

/**
 * psy 정보를 업데이트합니다.
 * @param {*} psyId
 * @param {*} param1
 * @returns
 */
export const updatePsy = async (
    psyId,
    { title, description, thumbnail, isOpened, questions },
) => {
    const queryString = `
        UPDATE admin.psy
        SET
            ${updateSetQuery({
                title,
                description,
                thumbnail,
                isOpened,
                questions: JSON.stringify(questions),
            })}
        WHERE
            id=${psyId}
        RETURNING *
    `;
    return QUERY(queryString);
};

/**
 * result 정보를 업데이트합니다.
 * @param {*} resultId
 * @param {*} param1
 * @returns
 */
export const updateResult = async (
    resultId,
    { thumbnail, result, description },
) => {
    const queryString = `
    UPDATE admin.psy_result
    SET
        ${updateSetQuery({ thumbnail, result, description })}
    WHERE
        id=${resultId}
    RETURNING *
    `;

    return QUERY(queryString);
};

/**
 * opengraph 정보를 업데이트합니다.
 * @param {*} opengraphId
 * @returns
 */
export const updateOpengraph = async (
    opengraphId,
    {
        commonUrl,
        commonTitle,
        commonDescription,
        commonImage,
        commonImageAlt,
        twitterUrl,
        twitterTitle,
        twitterDescription,
        twitterImage,
        twitterHashtag,
    },
) => {
    const queryString = `
        UPDATE admin.opengraph
        SET
            ${updateSetQuery({
                commonUrl,
                commonTitle,
                commonDescription,
                commonImage,
                commonImageAlt,
                twitterUrl,
                twitterTitle,
                twitterDescription,
                twitterImage,
                twitterHashtag,
            })}
        WHERE
            id=${opengraphId}
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
    return (await QUERY(queryString))[0].id;
};

/**
 * 새로운 psy_review를 생성하고 id를 반환합니다.
 * @param {*} psyId
 * @param {*} review
 * @returns Number : id of inserted psy_reivew
 */
export const insertReview = async (psyId, review) => {
    const queryString = `
        INSERT INTO psy_review
        (
            psy_id,
            review
        )
        VALUES
        (
            ${psyId},
            '${review}'
        )
        RETURNING id;
    `;
    return (await QUERY(queryString))[0].id;
};

/**
 * 새로운 opengraph를 생성하고 id를 반환합니다.
 * @returns Number : id of inserted psy_reivew
 */
const insertOpengraph = async (
    title = '',
    description = '',
    thumbnail = '',
) => {
    const queryString = `
        INSERT INTO admin.opengraph
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
            '${title}',
            '${description}',
            '${thumbnail}',
            '',
            '',
            '${title}',
            '${description}',
            '${thumbnail}',
            ''
        )
        RETURNING id;
    `;
    return (await QUERY(queryString))[0].id;
};

/**
 * 새로운 psy를 생성하고 id를 반환합니다.
 * @returns Number : id of inserted psy
 */
export const insertPsy = async () => {
    const ogId = await insertOpengraph();
    const viewId = await insertView();
    const queryString = `
        INSERT INTO admin.psy
        (
            title,
            description,
            thumbnail,
            is_opened,
            questions,
            opengraph_id,
            psy_view_id
        )
        VALUES
        (
            '',
            '',
            '',
            false,
            '[]',
            ${ogId},
            ${viewId}
        )
        RETURNING id;
    `;

    return (await QUERY(queryString))[0].id;
};

/**
 * 새로운 psy_result를 생성하고 id를 반환합니다.
 * @param {*} psyId
 * @returns Number : id of inserted psy_result
 */
export const insertResult = async (psyId) => {
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
    return (await QUERY(queryString))[0].id;
};

/*--------------------------------------------------------

DELETE

--------------------------------------------------------*/

/**
 * psy를 삭제합니다.
 * @param {*} psyId
 * @returns
 */
export const deletePsy = async (psyId) => {
    const { opengraphId, psyViewId } = (await selectPsyById(psyId))[0];

    // delete psy_review
    await QUERY(`
        DELETE FROM psy_review
        WHERE psy_id=${psyId}
    `);

    // delete psy
    await QUERY(`
        DELETE FROM admin.psy
        WHERE id=${psyId}
    `);

    // delete opengraph
    await QUERY(`
        DELETE FROM admin.opengraph
        WHERE id=${opengraphId}
    `);

    // delete psy_view
    await QUERY(`
        DELETE FROM psy_view
        WHERE id=${psyViewId}
    `);

    return true;
};

/**
 * psy_result 를 삭제합니다.
 * @param {*} resultId
 * @returns
 */
export const deleteResult = async (resultId) => {
    const { opengraphId, psyViewId } = (await selectResultById(resultId))[0];

    // delete psy_result
    await QUERY(`
        DELETE FROM admin.psy_result
        WHERE id=${resultId}
    `);

    // delete opengraph
    await QUERY(`
        DELETE FROM admin.opengraph
        WHERE id=${opengraphId}
    `);

    // delete psy_view
    await QUERY(`
        DELETE FROM psy_view
        WHERE id=${psyViewId}
    `);

    return true;
};
