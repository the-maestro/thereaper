const { version } = require("discord.js");
require("moment-duration-format");
const moment = require("moment");
exports.run = (client, message, args, sql) =>{
    if(message.channel.name === 'the-reaper'){
            const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
            message.channel.send(`= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.size.toLocaleString()}
• Servers    :: ${client.guilds.size.toLocaleString()}
• Channels   :: ${client.channels.size.toLocaleString()}
• Node       :: ${process.version}`, {code: "asciidoc"});
}
else{
    var channel = message.guild.channels.find("name", "the-reaper")
    message.reply(`The Reaper forbids this command from being used outside ${channel}`)
}
}