const express = require('express');
const Levels = require("discord-xp");
const prefix = 'd!'
const {Database}  = require("quickmongo");
const db = new Database(`mongodb+srv://Velvet:cZQk4SVbG9utLM5h@cluster0.vx3jf.mongodb.net/dev-center?retryWrites=true&w=majority`);
const Discord = require('discord.js')
const client = new Discord.Client({intents : 32767}) 
require('dotenv').config()
Levels.setURL(`${`mongodb+srv://Velvet:cZQk4SVbG9utLM5h@cluster0.vx3jf.mongodb.net/dev-center?retryWrites=true&w=majority`}`)

  const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(3000)
db.on("ready", async () => {
  console.log("Connected to the database");
});
client.on('ready' , async () => {
  await db.connect()
  console.log(`Logged in as ${client.user.tag}`)
  client.user.setActivity(`Your Points`, {
    type: "WATCHING",
  })
  
  client.user.setPresence({
    status: "idle",
  })})

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  
  const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
  const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
  if (hasLeveledUp) {
    const user = await Levels.fetch(message.author.id, message.guild.id);
    message.channel.send({ content: `${message.author}, Congrats!! You have leveled up to **#${user.level}**. :tada:` });
  }
});



client.on('messageCreate', async (message) => {
if (message.content === 'd!points'){
   
  const target = message.mentions.users.first() || message.author; // Grab the target.

  const user = await Levels.fetch(target.id, message.guild.id, true); // Selects the target from the database.
  
//   const rank = new canvacord.Rank() // Build the Rank Card
//       .setAvatar(target.displayAvatarURL({format: 'png', size: 512}))
//       .setCurrentXP(user.xp) // Current User Xp
//       .setRequiredXP(Levels.xpFor(user.level + 1)) // We calculate the required Xp for the next level
//       .setRank(user.position) // Position of the user on the leaderboard
//       .setLevel(user.level) // Current Level of the user
//       .setProgressBar("#FFFFFF")
//       .setUsername(target.username)
//       .setDiscriminator(target.discriminator);

    const embed = new Discord.MessageEmbed()
    .setAuthor({name : `${message.author.username} Rank` , iconURL : message.author.avatarURL({dynamics:true})})
    .addField(`Rank` , `${user.position}` , true)
    .addField(`Level` , `${user.level}` , true)
    .addField(`XP` , `${user.xp + "/" + Levels.xpFor(user.level + 1)}`)
    .setThumbnail(message.guild.iconURL({dynamic:true}))
    .setFooter({text : `Earn XP by chatting`})
    .setColor("BLURPLE")

    message.reply({embeds : [embed]})
}
  })

  client.on('messageCreate', async (message) => {
    if (message.content=== prefix + 'top'){
      const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10); // We grab top 10 users with most xp in the current server.

      if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");
      
      const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.
      
      const lb = leaderboard.map(e => `\`#${e.position}.\` ${e.username} - Level: **${e.level}** - XP: ${e.xp.toLocaleString()}`); // We map the outputs.
      const embed  = new Discord.MessageEmbed()
      .setAuthor({name : `${message.guild.name}'s Leaderboard`, iconURL : message.guild.iconURL({dynamic:true})})
      .setDescription(`${lb.join("\n\n")}`)
      .setColor('BLURPLE')
      .setFooter({text : `Earn XP by chatting!`})
      message.channel.send({embeds : [embed]});
    
      ;}
      })
    
client.login("OTYxMzc3MDU3NDA3OTA1ODA1.Yk4GKA.-Vpm51cj25cs7wAZn29l-CUDWAM")