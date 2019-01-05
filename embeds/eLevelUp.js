module.exports.levelUpEmbed = function(bot, message, Discord, level) {
    var embed = new Discord.RichEmbed()
        .setTitle(message.author.username)
        .setDescription(`**CONGRATS**\nYou are now level **${level}**!!!`)
        .setColor(0x00AE86)
        .setThumbnail(message.author.displayAvatarURL);

    message.guild.channel.find("name", "the-reaper").send({embed: embed});

}