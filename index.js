require('dotenv').config();
const Discord = require('discord.js')

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMessageReactions
  ]
})

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.messageDelete = new Discord.Collection()

const handlers = ["command", "distube-handler"];
handlers.forEach(handler => {
    require(`./handlers/${handler}`)(client);
  });

client.on('ready', () => {
  console.log(`${client.user.tag} is ready to play music.`)
  
  client.user.setPresence({
    activities: [{ name: `${client.user.username}`, type: Discord.ActivityType.Listening }],
    status: 'online',
    });

})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  const prefix = process.env.prefix
  if (!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return
  if (cmd.inVoiceChannel) {
    const voiceChannel = message.member.voice.channel
    const queue = client.distube.getQueue(message)
    if (!voiceChannel)
    return message.channel.send(`❌ ERROR | Please join a Channel first.`).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })

    if (queue && voiceChannel.id !== message.member.guild.members.me.voice.channelId)
        return message.channel.send(
          `❌ ERROR | Please join <#${message.member.guild.members.me.voice.channelId}> Channel first`
        ).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })
  }
  try {
    try {
        message.delete();
    } catch (e) {}
    cmd.run(client, message, args)
  } catch (e) {
    console.error(e)
    message.channel.send(`Error: \`${e}\``)
  }
})

client.login(process.env.token)