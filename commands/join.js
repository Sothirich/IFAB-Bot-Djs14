const { Constants } = require('discord.js')

module.exports = {
  name: 'join',
  aliases: ['j'],
  run: async (client, message, args) => {
    let voiceChannel = message.member.voice.channel
    if (args[0]) {
      voiceChannel = await client.channels.fetch(args[0])
      if (!Constants.VoiceBasedChannelTypes.includes(voiceChannel?.type)) {
        return message.channel.send(`❌ ERROR | ${args[0]} is not a valid voice channel!`).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })
      }
    }
    if (!voiceChannel) {
      return message.channel.send(
        `❌ ERROR | You must be in a voice channel or enter a voice channel id!`
      ).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })
    }
    client.distube.voices.join(voiceChannel)
  }
}