const { sql, poolPromise } = require('../config/database');

const threadService = {
    getListByGroupId: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('groupId', sql.Int, data.groupId)
                .input('search', sql.VarChar, `%${data.search}%`)
                .input('size', sql.Int, 50)
                .input('page', sql.Int, data.page)
                .query('SELECT t.id AS id, t.title AS title, u.id AS userId, u.username AS createdBy, COUNT(p.id) AS [count], MAX(p.updatedAt) AS lastReplied FROM [thread] t INNER JOIN [user] u ON t.createdBy = u.id LEFT JOIN [post] p ON t.id = p.threadId WHERE t.groupId = @groupId AND (t.title LIKE @search OR t.title IS NULL AND @search IS NULL) GROUP BY t.id, t.title, u.id, u.username ORDER BY lastReplied DESC OFFSET @size * (@page - 1) ROWS FETCH NEXT @size ROWS ONLY;');

            return result.recordset;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    getCountByGroupId: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('groupId', sql.Int, data.groupId)
                .input('search', sql.VarChar, `%${data.search}%`)
                .query('SELECT COUNT(id) count FROM [thread] WHERE groupId = @groupId AND title LIKE @search;');

            return result.recordset[0].count;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    getById: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, data.id)
                .query('SELECT t.id, t.title, t.content, t.createdBy, u.id AS userId, u.avatar, u.username, t.createdAt, t.updatedAt FROM [thread] t INNER JOIN [user] u ON t.createdBy = u.id WHERE t.id = @id');

            return result.recordset[0];
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    getByLikes: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('size', sql.Int, 50)
                .query('SELECT t.id, t.title, t.content, t.createdBy, u.id AS userId, u.username, g.id AS groupId, g.avatar AS groupAvatar, g.name AS groupName, COUNT(DISTINCT p.id) AS replies, COUNT(DISTINCT tl.id) AS likes FROM [thread] t INNER JOIN [user] u ON t.createdBy = u.id INNER JOIN [group] g ON t.groupId = g.id LEFT JOIN [post] p ON t.id = p.threadId LEFT JOIN [thread_likes] tl ON tl.threadId = t.id GROUP BY t.id, t.title, t.content, t.createdBy, u.id, u.username, g.id, g.avatar, g.name ORDER BY likes DESC OFFSET 0 ROWS FETCH NEXT @size ROWS ONLY;');

            return result.recordset;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    create: async (data) => {
        try {
            const dateNow = new Date();

            const pool = await poolPromise;
            const result = await pool.request()
                .input('groupId', sql.VarChar, data.groupId)
                .input('title', sql.VarChar, data.title)
                .input('content', sql.VarChar, data.content)
                .input('createdBy', sql.Int, data.createdBy)
                .input('createdAt', sql.DateTime, dateNow)
                .input('updatedAt', sql.DateTime, dateNow)
                .query('INSERT INTO [thread] (groupId, title, content, createdBy, createdAt, updatedAt) OUTPUT INSERTED.id VALUES (@groupId, @title, @content, @createdBy, @createdAt, @updatedAt)');

            return result.recordset[0];
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    updateById: async (data) => {
        try {
            const dateNow = new Date();

            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, data.id)
                .input('title', sql.VarChar, data.title)
                .input('content', sql.VarChar, data.content)
                .input('updatedAt', sql.DateTime, dateNow)
                .query('UPDATE [thread] SET title = @title, content = @content, updatedAt = @updatedAt WHERE id = @id');

            return result.rowsAffected;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    isLikeByUserId: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('userId', sql.Int, data.userId)
                .input('threadId', sql.Int, data.threadId)
                .query('SELECT COUNT(id) AS count FROM thread_likes WHERE userId = @userId AND threadId = @threadId;')

            return result.recordset[0].count > 0;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    addLike: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('userId', sql.Int, data.userId)
                .input('threadId', sql.Int, data.threadId)
                .query('INSERT INTO thread_likes VALUES (@userId, @threadId);')
            
            return result.rowsAffected[0] > 0;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    deleteLike: async (data) => {
        try {
            console.log(data)
            const pool = await poolPromise;
            const result = await pool.request()
                .input('userId', sql.Int, data.userId)
                .input('threadId', sql.Int, data.threadId)
                .query('DELETE FROM thread_likes WHERE userId = @userId AND threadId = @threadId;')
            
            return result.rowsAffected[0] > 0;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    getByUserId: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request() 
                .input('userId', sql.Int, data.userId)
                .query('SELECT * FROM [thread] WHERE createdBy = @userId');

            return result.recordset;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    }
}

module.exports = threadService;