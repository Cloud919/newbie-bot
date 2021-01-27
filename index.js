const Discord = require('discord.js');
const client = new Discord.Client();
const cfg = require('./config.json');

client.once("ready", () => {
    console.log(`Discord Login Success With ${client.user.tag}`);
    client.user.setActivity('Supporting Newbie!',{
        type: 'PLAYING'
    });
});


client.login(cfg.token);