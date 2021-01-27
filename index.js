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

client.on('message', async msg => {
    const args = msg.content.split("#");
    const code = args[1];
    const result = await db('SELECT * FROM vrp_newbie_bonus WHERE code = ?', [code]);
    const results = result[0];

    if (msg.channel.id != cfg.channelId) {
        return false
    }
    if (msg.author.id == cfg.botId){
        return false
    }
    if (!msg.content.startsWith(cfg.prefix)){
        msg.reply("올바른 명령어가 아닙니다. 입력 예시와 같이 입력 바랍니다. (입력예시 : 뉴비인증#123456)")
        return false
    }
    if (!code || code.length < 4){
        msg.reply("올바른 코드가 아닙니다. 입력 예시와 같이 입력 바랍니다. (입력예시 : 뉴비인증#123456)");
        return false
    }
    console.log(results.state);
})


client.login(cfg.token);