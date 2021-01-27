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
    let args = msg.content.split("#");
    let code = args[1];
    const result = await db('SELECT * FROM vrp_newbie_bonus WHERE code = ?', [code]);
    let results = result[0];
    let mb_id = msg.author.id;
	let mbr = msg.guild.members.cache.get(mb_id);

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
    if (!result || !results) {
        msg.reply('올바른 코드가 아닙니다. 게임 내에서 코드가 정상적으로 발급되었는지 확인바랍니다.');
        return false
    }
    if (results.state != 0) {
        msg.reply('이미 인증이 완료되었습니다.');
        return false
    }
    if (results.state == 0) {
        db('UPDATE vrp_newbie_bonus SET state = 1 WHERE code = ?', [code]);
        mbr.roles.add(cfg.roleId).catch(console.error);
        msg.reply('인증 및 권한 지급이 완료되었습니다. 게임 내에서 지원을 받으세요.');
    }
});


client.login(cfg.token);