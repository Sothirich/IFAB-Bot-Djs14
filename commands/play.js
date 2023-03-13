const Discord = require('discord.js');

module.exports = {
  name: 'play',
  aliases: ['p'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    try {
      const string = args.join(' ');
      const voiceChannel = message.member.voice.channel

      if (!string)
        return message.channel.send(
          `❌ ERROR | Please enter a song url or query to search.`
        ).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })
    
      message.channel.send({
          embeds: [new Discord.EmbedBuilder()
          .setColor('#ED4245')
          .setDescription("Searching... ")
          ]}
      ).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 6000) })

      client.distube.play(voiceChannel, string, {
          member: message.member,
          textChannel: message.channel,
          message,
        });
    } catch (e) {
      console.log(e)
      return message.channel.send({
        embeds: [new Discord.EmbedBuilder()
        .setColor('#ED4245')
        .setTitle(`❌ ERROR | An error occurred`)
        .setDescription(`\`\`\`${e.stack}\`\`\``)
        ]}
      )
    }
  },
};
