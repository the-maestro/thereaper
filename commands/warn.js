const Discord = require("discord.js");
const fs = require("fs-extra");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./modules/warnings.json", "utf8"));
const config = require('../config/config');

//metadata
module.exports = {
  name: 'warn',
  syntax: `${config.prefix}warn [@user {reason}]`,
  description: 'Sets a warning on a user. Admin only.',
  help: 'Sets a warning to the tagged user for a reason. 2 warnings gives a temp mute and 3 gives a ban. Admin only.',
  usage: [
    `\`${config.prefix}warn [@user] {reason}\` + Gives a warning.`,
  ],
};

module.exports.run = async (bot, message, args) => {
  if(!message.member.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
    return message.reply("The Reaper ignores you.")
  }
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.reply("Couldn't find them yo");
  if(wUser.roles.some(r=>["Admin", "Lead Admin", "Co-Founder", "Founder"].includes(r.name)) ){
    return message.reply("The Reaper cannot warn this person.")
  }
  let reason = args.join(" ").slice(22);

  if(!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };

  warns[wUser.id].warns++;

  fs.writeFile("./modules/warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });

  let warnEmbed = new Discord.RichEmbed()
  .setDescription("Warnings")
  .setAuthor(message.author.username)
  .setColor("#fc6400")
  .addField("Warned User", `<@${wUser.id}>`)
  .addField("Warned In", message.channel)
  .addField("Number of Warnings", warns[wUser.id].warns)
  .addField("Reason", reason);

  let warnchannel = message.guild.channels.find(`name`, "bot-admins");
  if(!warnchannel) return message.reply("Couldn't find channel");

  warnchannel.send(warnEmbed);

  if(warns[wUser.id].warns == 2){
    let muterole = message.guild.roles.find(`name`, "Muted");
    if(!muterole) return message.reply("The Reaper request you make the 'Muted' role.");

    let mutetime = "10s";
    await(wUser.addRole(muterole.id));
    message.channel.send(`<@${wUser.id}> has been temporarily muted`);

    setTimeout(function(){
      wUser.removeRole(muterole.id)
      message.reply(`<@${wUser.id}> has been unmuted.`)
    }, ms(mutetime))
  }
  if(warns[wUser.id].warns == 3){
    message.guild.member(wUser).ban(reason);
    message.reply(`<@${wUser.id}> has been banned.`)
    .catch((err) => {
      message.react('?');
      message.channel.send(err.message);
  });
  };
};