const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true});
const config = require('./config.json');
const sql = require(`sqlite`);
sql.open(`./score.sqlite`);


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

  if (message.channel.type === "dm") return;
  if (message.author.bot) return;
  

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}" AND guildId="${message.guild.id}"`).then(row => {
    if (!row) {
      sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [message.guild.id,message.author.id, 1, 0]);
    } 
    else {
      let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
      if (curLevel > row.level) {
        row.level = curLevel;
        sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
        message.reply(`Gratulacje, zdobyłeś kolejny poziom: **${curLevel}**!`);
    }
      sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
    }
  }).catch(() => {
    console.error;
    sql.run("CREATE TABLE IF NOT EXISTS scores (guildId TEXT, userId TEXT, points INTEGER, level INTEGER)").then(() => {
      sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [message.guild.id, message.author.id, 1, 0]);
    });
  });

  if (message.content.indexOf(config.prefix) !== 0) return;


  const name = [
  ["help", "h", "hlp"],
  ["ping", "pi"],
  ["say", "s"],
  ["invite", "i", "inv", "in"],
  ["remind", "r", "rem", "remindme", "rmd"],
  ["rand", "rnd", "random"],
  ["points", "p"],
  ["level", "lv", "l"],
  ["top", "t"]
  ];
  

   description = [
  "- komendy",
  "- czas odpowiedzi serwera",
  "abc def - anonimowe wyznanie",
  "- zaproś bohta na własny serwer",
  "t[s/m/h/d] abc def - wiadomość do przypomnienia",
  "x - losowa liczba od 1 do x",
  "- ilość Twoich punktów",
  "- Twój poziom IQ",
  "- lista osób z największą ilością punktów",
  ];  

  class Cmd {
    constructor(name, fun, description) {
      this.name = name;
      this.fun = fun;
      this.description = description;
    }
  
  }

  let fun = [
    ///help
    () => {
    let o = "```";
    for (let i = 0; i < name.length; i++) o += (config.prefix+name[i][0]+" "+description[i]+"\n\n");
    o += "```";
    message.channel.send(o);
    },
    ///ping
    async () => {
      let msg = await message.channel.send(`ping?`);
      msg.edit(`pong! ${msg.createdTimestamp - message.createdTimestamp}ms`);
    },
    ///say
    () => {
      const sayMessage = args.join(` `);
      message.delete().catch(O_o=>{});
      message.channel.send(sayMessage);
    },
    ///inv
    () => {
      message.channel.send(`https://goo.gl/s68s91`);
    },
    ///remind
    () => {
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
    //rand
    () => {
      let msg1 = message;
      let x;
      let msg = message.content.split(' ');

      y = msg[1].substring(0, (msg[1].length));

      let rand = (max) => {return 1+Math.floor(Math.random() * Math.floor(max));}
      msg1.channel.send(rand(y));
    },
    //points
    () => {
      msg = message;
      sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}" AND guildId="${msg.guild.id}"`).then(row => {
        if (!row) return message.reply(`Posiadasz 0 punktów`);
        msg.reply(`Ilość Twoich punktów: ${row.points}`);
        console.log(msg.guild.id);
      });
    },
    //level
    () => {
      msg = message;
      sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}" AND guildId="${msg.guild.id}"`).then(row => {
        if (!row) return message.reply(`Posiadasz 0 punktów`);
        msg.reply(`Twój poziom: ${row.level}`);
        console.log(msg.guild.id);
      });
    },
    //top
    async () => {
      msg = message;
      let o = "```glsl\n_________________________\n";
      let c = 0;
      for (let i = 0; i < 10; i++) {

        await sql.get(`SELECT userId, level, points FROM scores WHERE guildId="${msg.guild.id}" ORDER BY points DESC LIMIT 1 OFFSET ${i}`).then(row => {
          if (!row) return message.reply(`---\n`);

          //o += i+1 + " " +msg.guild.members.get(row.userId).displayName + "\n        " + row.level + " " +row.points + "\n";
          //o += `${i+1}.                         lv: ${row.level} || exp: ${row.points} \n   ${msg.guild.members.get(row.userId).displayName}`;
         // client.setTimeout(() => {
            o += `${i+1}.   ${msg.guild.members.get(row.userId).displayName}\n________lv: ${row.level} || exp: ${row.points} \n`;
          //}, 1);
          

          if (i==9) {
            o += "```";
            console.log(o);
            msg.channel.send(o);
          }
          //console.log(c);

          //msg.channel.send(o);
          
      });

      }
      //console.log(o);
      
      
      //msg.channel.send(c);
    },
  ];

  let cmd = [];
  for (var i = 0; i < fun.length; i++) {
    cmd.push(new Cmd(name[i], fun[i], description[i]));
  }



  if (name[0].includes(command)) {cmd[0].fun();} 
  else if (name[1].includes(command)) {cmd[1].fun();}
  else if (name[2].includes(command)) {cmd[2].fun();}
  else if (name[3].includes(command)) {cmd[3].fun();}
  else if (name[4].includes(command)) {cmd[4].fun();}
  else if (name[5].includes(command)) {cmd[5].fun();} 
  else if (name[6].includes(command)) {cmd[6].fun();}
  else if (name[7].includes(command)) {cmd[7].fun();}
  else if (name[8].includes(command)) {cmd[8].fun();}


});
client.login(config.token);
