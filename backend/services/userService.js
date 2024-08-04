const { sql, poolPromise } = require('../config/database');

const userService = {
    getById: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, data.id)
                .query('SELECT * FROM [user] WHERE id = @id');

            return result.recordset[0];
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    getByEmail: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('email', sql.VarChar, data.email)
                .query('SELECT * FROM [user] WHERE email = @email');

            return result.recordset[0];
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    create: async (data) => {
        try {
            const timestamp = Date.now().toString();
            const dateNow = new Date();

            const pool = await poolPromise;
            const result = await pool.request()
                .input('email', sql.VarChar, data.email)
                .input('username', sql.VarChar, timestamp)
                .input('password', sql.VarChar, data.password)
                .input('createdAt', sql.DateTime, dateNow)
                .input('updatedAt', sql.DateTime, dateNow)
                .query('INSERT INTO [user] (email, username, password, createdAt, updatedAt) OUTPUT INSERTED.id, INSERTED.username VALUES (@email, @username, @password, @createdAt, @updatedAt)');

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
                .input('username', sql.VarChar, data.username)
                .input('avatar', sql.VarChar, data.avatar)
                .input('updatedAt', sql.DateTime, dateNow)
                .query('UPDATE [user] SET username = @username, avatar = @avatar, updatedAt = @updatedAt WHERE id = @id');

            return result.rowsAffected;
        }
        catch (error) {
            console.error('Error updateUserById: ', error);
            throw error;
        }
    },
    deleteById: async (id) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE [user] WHERE id = @id');

            return result.recordset;
        }
        catch (error) {
            console.error('Error deleteUserById: ', error);
            throw error;
        }
    }
}

module.exports = userService;