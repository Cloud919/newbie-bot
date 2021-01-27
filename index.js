const Discord = require('discord.js');
const client = new Discord.Client();
const mysql = require('mysql2/promise');
const cfg = require('./config.json');

const pool = mysql.createPool({
    host: cfg.host,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database
});

const db = async (sql, params) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query(sql, params);
            connection.release();
            return rows;
        } catch (e) {
            console.log('Query Error');
            connection.release();
            return false;
        }
    } catch (e) {
        console.log('DB Error');
        return false;
    }
};

client.once("ready", () => {
    console.log(`Discord Login Success With ${client.user.tag}`);
    client.user.setActivity('Supporting Newbie!',{
        type: 'PLAYING'
    });
});


client.login(cfg.token);