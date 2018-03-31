const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');

client.on('ready', () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} servers.`);
  client.user.setActivity(config.prefix + "help || " + config.prefix + "invite");
  client.user.setStatus("dnd");

});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);

});

client.on('message', async message => {

  if (message.channel.isPrivate) {
                console.log(`(Private) ${message.author.username}: ${message.content}`);
        } else {
                console.log(`(${message.guild.name} / ${message.channel.name}) ${message.author.username}: ${message.content}`);
        }

  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;

  
  var array = ["help", "ping", "say", "invite"];
  var array2 = [" ", " ", " anonimowe_wyznania", " "];

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case array[0]:
    for (var i = 0; i < array.length; i++) {
      message.channel.send("```."+array[i]+array2[i]+"```");
      
    }
      
      break;
    case array[1]:
      const m = await message.channel.send("ping?");
      m.edit(`pong! ${m.createdTimestamp - message.createdTimestamp}ms`);
  
      break;

    case array[2]:
      // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
      // To get the "message" itself we join the `args` back into a string with spaces: 
      const sayMessage = args.join(" ");
      // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
      message.delete().catch(O_o=>{}); 
      // And we get the bot to say the thing: 
      message.channel.send(sayMessage);
      break;

    case array[3]:
    
      message.channel.send("https://goo.gl/tfjfWB");
      
      break;




    default:

  }

});




client.login(config.token);
