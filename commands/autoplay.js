const Discord = require('discord.js')

module.exports = {
  name: 'autoplay',
  aliases: ['ap', 'auto'],
  inVoiceChannel: true,
  run: async (client, message) => {
    try {
      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send(`❌ ERROR | There is nothing in the queue right now!`).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })
      const autoplay = queue.toggleAutoplay()

      message.channel.send({
          embeds: [new Discord.EmbedBuilder()
              .setColor("#ED4245")
              .setFooter(
                  { 
                      text: client.user.tag, 
                      iconURL: client.user.displayAvatarURL({ dynamic: true }) 
                  }
              )
              .setTitle(`✅ Successfully toggled Autoplay! It's now: ${autoplay ? "ON" : "OFF"}`)
          ]}
      ).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })
    } catch (e) {
      console.log(String(e.stack).bgRed)
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
