const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Bot has started, with ${client.users.size} users, in 
    ${client.channels.size} channels of ${client.guilds.size} servers.`);
  client.user.setActivity(`${config.prefix}help || ${config.prefix}invite`);
  client.user.setStatus("dnd");

});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
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

  let name = [];
  name[0] = ["h", "help", "hlp"];
  name[1] = ["p", "ping"];
  name[2] = ["s", "say"];
  name[3] = ["i", "invite", "inv", "in"];
  name[4] = ["r", "rem", "remind", "remindme", "rmd"];
  name[5] = ["rnd", "rand", "random"];

  description = [
  "- komendy",
  "- czas odpowiedzi serwera",
  "abc def - anonimowe wyznanie",
  "- zaproś bohta na własny serwer",
  "t[s/m/h/d] abc def - wiadomość do przypomnienia",
  "x - losowa liczba od 1 do x"
  ];  

  function Cmd(name, fun, description) {
    this.name = name;
    this.fun = fun;
    this.description = description;
  }

  let fun = [
    function() {
    let o = "```";
    for (let i = 0; i < name.length; i++) o += (config.prefix+name[i][0]+" "+description[i]+"\n\n");
    o += "```";
    message.channel.send(o);
    },
    async function() {
      let msg = await message.channel.send(`ping?`);
      msg.edit(`pong! ${msg.createdTimestamp - message.createdTimestamp}ms`);
    },
    function() {
      const sayMessage = args.join(` `);
      message.delete().catch(O_o=>{});
      message.channel.send(sayMessage);
    },
    function() {
      message.channel.send(`https://goo.gl/s68s91`);
    },
    function() {
      let msg1 = message;
      let msg2 = message;
      let returntime;
      let timemeasure;
      let msg = message.content.split(' ');
      console.log(`Message recieved from ${msg2.author.username}`);

      timemeasure = msg[1].substring((msg[1].length - 1), (msg[1].length));
      returntime = msg[1].substring(0, (msg[1].length - 1));

      const time = ['s', 'm', 'h', 'd'];
      if(time.includes(timemeasure)) {
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
        msg2.reply(`Podaj jednostkę czasu! s/m/h/d np 5m`);
      }
      client.setTimeout(() => {
        msg.shift();
        msg.shift();

        let content = msg.join();
        for (let i of msg) {
          content = content.replace(',', ' ');
          msg[i];
        }
        msg2.reply(content);
        console.log(`Message sent to ${msg2.author.id}`);
      }, returntime);
    },
    function() {
      let msg1 = message;
      let returntime;
      let x;
      let msg = message.content.split(' ');

      y = msg[1].substring(0, (msg[1].length));

      function rand(max) {
        return 1+Math.floor(Math.random() * Math.floor(max));
      }
        msg1.channel.send(rand(y));
    }
  ];

  let cmd = [];
  for (var i = 0; i < fun.length; i++) {
    cmd.push(new Cmd(name[i], fun[i], description[i]));
  }

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (name[0].includes(command)) {cmd[0].fun();} 
  else if (name[1].includes(command)) {cmd[1].fun();}
  else if (name[2].includes(command)) {cmd[2].fun();}
  else if (name[3].includes(command)) {cmd[3].fun();}
  else if (name[4].includes(command)) {cmd[4].fun();}
  else if (name[5].includes(command)) {cmd[5].fun();} 
});
client.login(config.token);
