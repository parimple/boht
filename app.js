const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');

client.on('ready', () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} servers.`);
  client.user.setActivity(`${config.prefix}help || ${config.prefix}invite`);
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

  
  let array = ["help", "ping", "say", "invite", "remindme"];
  let array2 = [" ", " ", " anonimowe wyznanie", " ", " czas[s/m/h/d] wiadomość do przypomnienia"];

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case array[0]:
    for (let i = 0; i < array.length; i++) {
      message.channel.send("```"+config.prefix+array[i]+array2[i]+"```");
      
    }
    
    break;
    case array[1]:
    const m = await message.channel.send(`ping?`);
    m.edit(`pong! ${m.createdTimestamp - message.createdTimestamp}ms`);
    
    break;

    case array[2]:
      // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
      // To get the "message" itself we join the `args` back into a string with spaces: 
      const sayMessage = args.join(` `);
      // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
      message.delete().catch(O_o=>{}); 
      // And we get the bot to say the thing: 
      message.channel.send(sayMessage);
      break;

      case array[3]:
      
      message.channel.send(`Aby poprawnie działały wszystkie funkcje należy nadać uprawnienia zarządzania wiadomości lub wyższe: \nhttps://goo.gl/tfjfWB"`);
      break;

      case array[4]:

      let msg1 = message;
      

      let message2 = message;
      try {
        
      // Variables
      let returntime;
      let timemeasure;
      msg = message.content.split(' ');
      console.log(`Message recieved from ${message2.author.username}`);

      // Sets the return time
      timemeasure = msg[1].substring((msg[1].length - 1), (msg[1].length))
      returntime = msg[1].substring(0, (msg[1].length - 1))

      // Based off the delimiter, sets the time
      if (timemeasure == 's' || timemeasure == 'm' || timemeasure == 'h' || timemeasure == 'd' ) {
        msg1.channel.send(`Dobrze! Przypomnę za ${returntime}${timemeasure}!`);

        switch (timemeasure) {

          case 's':
          returntime = returntime * 1000;
          break;

          case 'm':
          returntime = returntime * 1000 * 60;
          break;

          case 'h':
          returntime = returntime * 1000 * 60 * 60;
          break;

          case 'd':
          returntime = returntime * 1000 * 60 * 60 * 24;
          break;

          default:
          returntime = returntime * 1000;
          break;
        } 

      } else {
        message2.reply(`Podaj jednostkę czasu! s/m/h/d np 5m`);
        break;

      }
      // Returns the Message
      client.setTimeout(() => {
        // Removes the first 2 array items
        msg.shift();
        msg.shift();

        // Creates the message
        let content = msg.join();
        for (let i of msg) {
          content = content.replace(',', ' ');
          msg[i];
        }

        message2.reply(content);
        console.log(`Message sent to ${message2.author.id}`);
      }, returntime)
    } catch (e) {
      message2.reply(`error chuje`);
      console.error(e.toString());
    }
    break;

    default:
  }
});
client.login(config.token);
