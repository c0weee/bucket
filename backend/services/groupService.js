const { sql, poolPromise } = require('../config/database');

const groupService = {
    getById: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, data.id)
                .query('SELECT g.*, u.username FROM [group] g INNER JOIN [user] u ON g.createdBy = u.id WHERE g.id = @id');

            return result.recordset[0];
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    getByMemberCount: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query('SELECT g.id, g.name, g.avatar, COUNT(gm.id) AS memberCount FROM [group] g INNER JOIN [group_members] gm ON g.id = gm.groupId GROUP BY g.id, g.name, g.avatar;');

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
                .input('name', sql.VarChar, data.name)
                .input('intro', sql.VarChar, data.intro)
                .input('avatar', sql.VarChar, data.avatar)
                .input('createdBy', sql.Int, data.createdBy)
                .input('createdAt', sql.DateTime, dateNow)
                .input('updatedAt', sql.DateTime, dateNow)
                .query('INSERT INTO [group] (name, intro, avatar, createdBy, createdAt, updatedAt) OUTPUT INSERTED.id VALUES (@name, @intro, @avatar, @createdBy, @createdAt, @updatedAt)');

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
                .input('name', sql.VarChar, data.name)
                .input('intro', sql.VarChar, data.intro)
                .input('avatar', sql.VarChar, data.avatar)
                .input('updatedAt', sql.DateTime, dateNow)
                .query('UPDATE [group] SET name = @name, intro = @intro, avatar = @avatar, updatedAt = @updatedAt WHERE id = @id');

            return result.recordset;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    deleteById: async (id) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE [group] WHERE id = @id');

            return result.recordset;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    isUserIn: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request() 
                .input('userId', sql.Int, data.userId)
                .input('groupId', sql.Int, data.groupId)
                .query('SELECT COUNT(*) AS count FROM [group_members] WHERE userId = @userId AND groupId = @groupId;');

            return result.recordset[0].count > 0;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    join: async (data) => {
        try {
            console.log(data);
            const pool = await poolPromise;
            const result = await pool.request() 
                .input('userId', sql.Int, data.userId)
                .input('groupId', sql.Int, data.groupId)
                .query('INSERT INTO [group_members] VALUES (@userId, @groupId);');

            return result.rowsAffected[0] == 1;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    exit: async (data) => {
        try {
            console.log(data);
            const pool = await poolPromise;
            const result = await pool.request() 
                .input('userId', sql.Int, data.userId)
                .input('groupId', sql.Int, data.groupId)
                .query('DELETE [group_members] WHERE userId = @userId AND groupId = @groupId;');

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
                .input('groupId', sql.Int, data.groupId)
                .query('SELECT gm.groupId, g.name, g.avatar FROM [group_members] gm INNER JOIN [group] g ON gm.groupId = g.id WHERE gm.userId = @userId');

            return result.recordset;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    }

}

module.exports = groupService;