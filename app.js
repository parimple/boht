const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true});
const config = require('./config.json');

const sql = require(`sqlite`);
sql.open(`./boht.sqlite`);

client.on("error", function(err) {
 console.log(err);
})

client.on('ready', () => {
  sql.run(`CREATE TABLE IF NOT EXISTS user (
    userId TEXT PRIMARY KEY, 
    reputation INTEGER, 
    repDate INTEGER, 
    creditsDate INTEGER, 
    userInfo TEXT, 
    credits INTEGER) without rowid`
    );

  sql.run(`CREATE TABLE IF NOT EXISTS guild (
    guildId TEXT PRIMARY KEY, 
    prefix TEXT, 
    language TEXT) without rowid`
    );

  sql.run(`CREATE TABLE IF NOT EXISTS role (
    roleId TEXT, 
    expireDate INTEGER, 
    role TEXT, 
    guildId TEXT, 
    PRIMARY KEY (roleId, guildId), 
    FOREIGN KEY(guildId) REFERENCES guild(guildId)) without rowid`
    );

  sql.run(`CREATE TABLE IF NOT EXISTS guild_user (
    score INTEGER, 
    tempScore INTEGER,  
    userGuildInfo TEXT,  
    userId TEXT,  
    guildId TEXT,  
    PRIMARY KEY (userId, guildId),  
    FOREIGN KEY(guildId)  REFERENCES guild(guildId), 
    FOREIGN KEY(userId)  REFERENCES user(userId)) without rowid`
    );

  sql.run(`CREATE TABLE IF NOT EXISTS channel (
    channelId TEXT, 
    channel TEXT, 
    active INTEGER, 
    guildId TEXT, 
    PRIMARY KEY (channelId, guildId), 
    FOREIGN KEY(guildId) REFERENCES guild(guildId)) without rowid`
    );

  sql.run(`CREATE TABLE IF NOT EXISTS role_user (
    expireDate INTEGER, 
    userId TEXT, 
    roleId TEXT,  
    active TEXT, 
    guildId TEXT,  
    PRIMARY KEY (userId, roleId, guildId),  
    FOREIGN KEY(roleId, guildId)  REFERENCES role(roleId, guildId), 
    FOREIGN KEY(userId)  REFERENCES user(userId)) without rowid`
    );

  sql.run(`CREATE TABLE IF NOT EXISTS message (
    messageId TEXT, 
    message TEXT, 
    active INTEGER, 
    guildId TEXT, 
    PRIMARY KEY (messageId, guildId), 
    FOREIGN KEY(guildId) REFERENCES guild(guildId)) without rowid`
    );
  

  console.log(`Bot has started, with ${client.users.size} users, in 
    ${client.channels.size} channels of ${client.guilds.size} servers.`);
  client.user.setActivity(`${config.prefix}help || ${config.prefix}invite`);
  client.user.setStatus("dnd");
})

client.on("guildCreate", guild => {

  sql.get(`SELECT * FROM guild WHERE guildId ="${guild.id}"`).then(row => {
    if (!row) {
      sql.run(`INSERT INTO guild (guildId, prefix, language) VALUES (?, ?, ?)`,
       [guild.id, ".", "PL"]);
    } 
  }).catch(() => {
    console.error;
  });
  
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

  client.guilds.get('449301348333256704').channels.get('451379467357650944')
  .send(`${guild.name} ${guild.id} memberCount:${guild.memberCount}`)

})

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);

  client.guilds.get('449301348333256704').channels.get('451379600497573888')
  .send(`${guild.name} ${guild.id}`)
})

client.on("guildMemberAdd", (member) => {
  console.log(`New User ${member.user.username} has joined ${member.guild.name}` );
  //member.guild.get('channelID').send(`Witaj na serwerze **${member.user.username}**'`);

  sql.get(`SELECT userId FROM user WHERE userId ="${member.user.id}"`).then(row => {
    if (!row) {
      sql.run(`INSERT INTO user (userId, reputation, repDate, creditsDate, userInfo, credits) VALUES (?, ?, ?, ?, ?, ?)`,
       [member.user.id, 0, 0, 0, "", 0]);
      sql.run(`INSERT INTO guild_user (score, tempScore, userGuildInfo, userId, guildId) VALUES (?, ?, ?, ?, ?)`,
       [0, 0, "", member.user.id, member.guild.id]);
      console.log("dziala bez niczego");
    }
    sql.get(`SELECT * FROM guild_user WHERE guildId ="${member.guild.id}" AND userId ="${member.user.id}"`).then(row => {
      if (!row) {
        sql.run(`INSERT INTO guild_user (score, tempScore, userGuildInfo, userId, guildId) VALUES (?, ?, ?, ?, ?)`,
         [0, 0, "", member.user.id, member.guild.id]);
        console.log("dziala tylko dla guser");
      } 
    }).catch(() => {
      console.error;
    });

  }).catch(() => {
    console.error;
  });

  console.log("siema");



  //insert into user select distinct userId, 0, 0, 0, "", 0
});

client.on('message', async message => {
  const dontShow = ['110373943822540800', '449301348333256704'];
  const translate = [
    //['325628628618575872', '451308189871243294'], //mfo2
    ['421016932964237312', '451297687174905867'], //antisocial
    ['299620511221153792', '451334976886276096'], //strefa pindola
    ['398207788188303370', '451335443364053012'], //strefa bloody marcina
    ['451042659033808897', '451466268705554433'], //gang nani
    ['451421726086135819', '451466602693787650'] //only polish boys
    ]
  //console.log(translate[0]);
  //console.log(translate[1]);

  if (!dontShow.includes(message.guild.id)) {
    if (message.channel.isPrivate) {
      console.log(`(Private) ${message.author.username}: ${message.content}`);
    } else {
      console.log(`(${message.guild.id} - ${message.guild.name} / ${message.channel.name})
        ${message.author.username}: \n${message.content}`);
      let flag = -1;
      for (var i = 0; i < translate.length; i++) {

        if (message.guild.id == translate[i][0]) {
          if (message.author.id == "163429533008134145") {
            client.guilds.get('449301348333256704').channels.get(translate[i][1])
            .send("(" + message.author.tag +")```" + message.content + "```");
            flag = i;
            break;

          }else
          {
            client.guilds.get('449301348333256704').channels.get(translate[i][1])
            .send("<@"+message.author.id+"> (" + message.author.tag +")```" + message.content + "```");
            flag = i;
            break;

          }


       // console.log('no znalazło');
     } 
     // console.log('no chyba nie');
   } if (flag < 0) {
    client.guilds.get('449301348333256704').channels.get('451300147813679105')
    .send(`*<@${message.author.id}> (${message.author.tag}) 
      (${message.guild.id}/${message.guild.name}/${message.channel.name})*\n` + "```"+message.content+"```")

    
  }
    //console.log(config.)
    //client.guilds.get('449301348333256704').channels.get('451300147813679105')
    //.send(`*(${message.guild.id} - ${message.guild.name} / ${message.channel.name}) <@${message.author.id}>*\n${message.content}`)

  }

}


if (message.channel.type === "dm") return;
if (message.author.bot) return;

const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();
  //console.log(args);

  //new db
  sql.get(`SELECT * FROM user WHERE userId =${message.author.id}`).then(row => {
    if (!row) {
      sql.run(`INSERT INTO user (userId, reputation, repDate, creditsDate, userInfo, credits) VALUES (?, ?, ?, ?, ?, ?)`, 
        [message.author.id, 0, 0, 0, "", 0]);
      sql.run(`INSERT INTO guild_user (guildId, userId, score, tempScore, userGuildInfo) VALUES (?, ?, ?, ?, ?)`, 
        [message.guild.id, message.author.id, 1, 1, ""]);
    }
    sql.get(`SELECT * FROM guild_user where userId ="${message.author.id}" AND guild_user.guildId="${message.guild.id}"`)
    .then(row => {
      if (!row) {
        sql.run(`INSERT INTO guild_user (guildId, userId, score, tempScore, userGuildInfo) VALUES (?, ?, ?, ?, ?)`, 
          [message.guild.id, message.author.id, 1, 1, ""]);
         //await Math.floor(0.1 * Math.sqrt(row.points + 1));

       }
       if (args.length > 2) {
        sql.run(`UPDATE guild_user SET score = ${row.score + 1}, tempScore = ${row.tempScore + 1}
          WHERE userId = ${message.author.id} AND guildId = ${message.guild.id}`);
      }

    })


  })


  if (message.content.indexOf(config.prefix) !== 0) return;

  const name = [
  ["help", "h", "hlp"],
  ["ping", "pi"],
  ["say", "s"],
  ["invite", "i", "inv", "in"],
  ["remind", "rem", "re", "remindme", "rmd"],
  ["rand", "rnd", "random"],
  ["points", "p"],
  ["pmonth", "pm", "pmo"],
  ["top", "t"],
  ["tmonth", "tm"],
  ["rep", "r"],
  ["setRole", "sr"],
  ["x", "x"]
  ];

  const description = [
  "spis komend bohta",
  "czas odpowiedzi serwera",
  "*bla bla bla* - anonimowe wyznanie",
  "zaproś bohta na własny serwer",
  "*t[s/m/h/d] bla bla* - wiadomość do przypomnienia",
  "*x* - losowa liczba od 1 do x",
  "ilość Twoich punktów",
  "ilość Twoich punktów w danym miesiącu",
  "*1, 2...*- lista osób z największą ilością punktów",
  "*1, 2...*- lista osób z najwyższym miesięcznym rankingiem",
  "*+[-] @user*- przydzielenie reputacji",
  "*autorole rola*- ustawienie autoroli",
  "tajne"
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
      let o = "";
      let n = ""; 
      let d = "";

      for (let i = 0; i < name.length; i++) o += (`**${config.prefix+name[i][0]} [${name[i][1]}]** \
        :black_small_square: ${description[i]}\n`);
        for (let i = 0; i < name.length; i++) n += (`${config.prefix+name[i][0]} [${name[i][1]}]\n`);
          for (let i = 0; i < name.length; i++) d += (`${description[i]}\n`);
            o += "";
    //message.channel.send(o);
    //
    message.channel.send({
      embed: {
        title: "help",
        color: 9252433,
        fields: [
        {
          "name": "komenda",
          "value": o,
          "inline": true
        }
        ]
      }
    });
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
      const x = `https://goo.gl/s68s91`;
      message.channel.send(x);
    },
    ///remind
    () => {
      let msg1 = message;
      let msg2 = message;
      let returntime;
      let timemeasure;
      let msg = message.content.split(' ');
      //console.log(`Message recieved from ${msg2.author.username}`);

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
        returntime = timemeasure * 1000 * 60;
        timemeasure = `m`;
        msg1.channel.send(`Dobrze! Przypomnę za ${returntime/1000/60}${timemeasure}!`);
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
        //console.log(`Message sent to ${msg2.author.id}`);
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
      let msg = message;

      sql.get(`SELECT * FROM guild_user WHERE userId ="${message.author.id}" AND guildId="${msg.guild.id}"`).then(row => {
        if (!row) return message.reply(`Posiadasz 0 punktów`);
        msg.reply(`Ilość Twoich punktów: ${row.score}`);
      });
    },
    //month points
    () => {
      let msg = message;
      sql.get(`SELECT * FROM guild_user WHERE userId ="${message.author.id}" AND guildId="${msg.guild.id}"`).then(row => {
        if (!row) return message.reply(`Posiadasz 0 punktów`);
        msg.reply(`Ilość punktów w tym miesiącu: ${row.tempScore}`);
      });
    },
    //top
    () => {
      let msg = message;
      let c = 0;

      let msg2 = message.content.split(' ');
      let y = 0;
      try {
        y = msg2[1].substring(0, (msg2[1].length));
      } catch(error) {
        y = 1;
      }

      sql.all(`SELECT userId, score FROM guild_user WHERE guildId="${msg.guild.id}"\
       ORDER BY score DESC LIMIT 10 OFFSET ${10*(y-1)}`)
      .then(rows => {
        var user = '';
        var score = '';
        var sum = '```glsl\n';
        var emb = new Array(10);
        var pos = '';
        var r = 10*y+1;
        rows.forEach(function (row) {
          //console.log(row);
          //console.log(r);
          let n;
          try {
            n = msg.guild.members.get(row.userId).displayName;
          } catch(error) {
            n = "undefined";
          };

          if (n != "undefined") {
            sum += `${r-10}. ${row.score} - #${msg.guild.members.get(row.userId).displayName} \n`
          } else { 
            sum += `${r-10}. ${row.score} - #${row.userId} \n`
          };
          r++;
        })
        sum += '```';
        console.log(emb);
        message.channel.send({
          embed: {
            title: `Top ${y*10}`,
            color: 9252433,
            fields: [

            {
              "name": "pozycja/punkty/użytkownik",
              "value": sum,
              "inline": true
            }

            ]

          }
        });
      })

    },
    //top month
    () => {
      let msg = message;
      let c = 0;

      let msg2 = message.content.split(' ');
      let y = 0;
      try {
        y = msg2[1].substring(0, (msg2[1].length));
      } catch(error) {
        y = 1;
      }

      sql.all(`SELECT userId, tempScore FROM guild_user WHERE guildId="${msg.guild.id}"
        ORDER BY tempScore DESC LIMIT 10 OFFSET ${10*(y-1)}`).then(rows => {
          var user = '';
          var score = '';
          var sum = '```glsl\n';
          var emb = new Array(10);
          var pos = '';
          var r = 10*y+1;
          rows.forEach(function (row) {
            console.log(row);
            console.log(r);
            let n;
            try {
              n = msg.guild.members.get(row.userId).displayName;
            } catch(error) {
              n = "undefined";
            };
            
            if (n != "undefined") {
              sum += `${r-10}. ${row.tempScore} - #${msg.guild.members.get(row.userId).displayName} \n`
            } else { 
              sum += `${r-10}. ${row.tempScore} - #${row.userId} \n`
            };
            r++;
          })
          sum += '```';
          console.log(emb);
          message.channel.send({
            embed: {
              title: `Miesięczny top ${y*10}`,
              color: 9252433,
                //description: `kupa`,
                "footer": {

                  "text": `rangę Active dostanie ${Math.floor(Math.sqrt(message.guild.memberCount))} osób`
                },

                fields: [

                {
                  "name": "pozycja/punkty/użytkownik",
                  "value": sum,
                  "inline": true
                }

                ],

              //Math.floor(0.1 * Math.sqrt(row.points + 1))
              
            }
          });
        })


      },
      //rep
      () => {
        let msg = message;
        let msg2 = message.content.split(' ');
        let y;
        let z;
        const x = 360;
        let dif = x+1;;
        try {
          y = msg2[1].substring(0, (msg2[1].length));
        } catch(error) {
          y = 1;
        }
        console.log(y);
        let mention =  msg.mentions.users.first();
        sql.get(`SELECT * FROM user WHERE userId="${msg.author.id}"`).then(row => {
        // console.log(mention);
        try {
          dif = Math.floor((msg.createdTimestamp-row.repDate)/1000/60);
        }
        catch(err) {
          dif = x+1;
        }
        console.log(dif);

        if (dif<x) {
          msg.reply(`Stan Twojej reputacji: **${row.reputation}**, możesz ją przydzielić za ${x-dif}m`);
        }
        else {
          if (mention == null) {
            msg.reply(`Stan Twojej reputacji: **${row.reputation}**, możesz już ją przydzielić`);
          } else if (mention.id == msg.author.id) {
            msg.reply(`Stan Twojej reputacji: **${row.reputation}**, możesz ją przydzielić komuś **fajnemu**`);
          } else {
            sql.get(`select * from user WHERE userId=${mention.id}`).then(row => {
              console.log(row);
              if (!row) {
                sql.run(`INSERT INTO user (userId, reputation, repDate, creditsDate, userInfo, credits) VALUES (?, ?, ?, ?, ?, ?)`,
                  [mention.id, 0, 0, 0, "", 0]);
              } 
              sql.run(`UPDATE user SET repDate=${msg.createdTimestamp} where userId = ${msg.author.id}`)
              if(y=='-') {
                sql.run(`UPDATE user SET reputation=${row.reputation - 1} where userId = ${mention.id}`)
                msg.channel.send(`-1 punkt reputacji dla <@${mention.id}>, razem: **${row.reputation-1}**`); 
              }else {
                sql.run(`UPDATE user SET reputation=${row.reputation + 1} where userId = ${mention.id}`)
                msg.channel.send(`+1 punkt reputacji dla <@${mention.id}> razem: **${row.reputation+1}**`); 
              }
            })

          }
        }


        // console.log(dif);
         //console.log(msg.createdTimestamp);
         //console.log(row.repDate);

       });
      },
      //setrole
      () => {
        let msg = message;

        let msg1 = message;
        let msg2 = message;
        let a;
        let b;
        msg = message.content.split(' ');
      //console.log(`Message recieved from ${msg2.author.username}`);
      roleId = msg[1];
      msg.shift();
      msg.shift();
      let roleName = msg.join();

      for (let i of msg) {
        roleName = roleName.replace(',', ' ').slice(0);
        msg[i];
      }
      //let role = message.guild.roles.find("name", roleName);
      //console.log(role);
      console.log(roleName); 
      //let role = message.guild.roles.get("421057284777705482");
      //let role = message.member.roles.find("name", roleName);
      let role;
      try {
        role = message.guild.roles.find("name", roleName).id;
      } catch(err) {
        msg2.channel.send('nie ma takiej roli');
        //return 0;

      }
      //a.toUpperCase();
      console.log(a);
      
      //let role = message.guild.roles.find("name", "Boty").id;
      //console.log(role);

      //console.log(role);
      //msg2.reply(role);
/*
      sql.run(`CREATE TABLE IF NOT EXISTS channel (
        channelId TEXT, 
        channel TEXT, 
        active INTEGER, 
        guildId TEXT, 
        PRIMARY KEY (channelId, guildId), 
        FOREIGN KEY(guildId) REFERENCES guild(guildId)) without rowid`
        );
        */
      },
    //xxx
    () => {
     // message.channel.send("D");
     /*
     let msg = message;

      sql.get(`SELECT * FROM guild WHERE guildId ="${msg.guild.id}"`)
      .then(async row => {
        msg.reply(`${row.prefix}`);
      
      }).catch(() => {

        sql.run("CREATE TABLE IF NOT EXISTS guild (guildId TEXT, welcome TEXT, goodbye TEXT, prefix TEXT, language TEXT)")
        .then(() => {
          sql.run("INSERT INTO guild (guildId, welcome, goodbye, prefix, language) VALUES (?, ?, ?, ?, ?)",
           [msg.guild.id, "witaj na serwerze!", "do zobaczenia!", ".", "PL"]);
          
        })
        .then(() => {
          sql.get(`SELECT * FROM guild WHERE guildId ="${msg.guild.id}"`)
          .then(row => {
            msg.channel.send(`${row.welcome}`);
          });

        console.error;

        })
        
        

      });
      */



      
      let msg1 = message;
      let z = msg1.createdTimestamp;

      client.setTimeout(() => {
        let msg2 = message;
        let y = msg2.createdTimestamp;
        msg1.channel.send(z);



      },5000)
 /*
    if(message.member.roles.find("name", "👑Anti Admin") || message.member.roles.find("name", "👑Beta / Moderator")){
        message.channel.send(`hej adminku`);
      } else message.channel.send(`no elo nieadminku`); */
/*
    
    if(message.member.permissions.has('ADMINISTRATOR')){
        message.channel.send(`hej adminku`);
    } else message.channel.send(`no elo nieadminku`);
    */

  }

  ];



  let cmd = [];
  for (var i = 0; i < fun.length; i++) {
    cmd.push(new Cmd(name[i], fun[i], description[i]));

  }

  for (var i = 0; i < name.length; i++) {
    if (name[i].includes(command)) {
      cmd[i].fun();
      break;
    }
  }
});

client.login(config.token);