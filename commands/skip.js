const Discord = require('discord.js')

module.exports = {
    name: 'skip',
    aliases: ['sk', 's', 'next'],
    inVoiceChannel: true,
    run: async (client, message) => {
      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send(`❌ ERROR | There is nothing in the queue right now!`).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })
      try {
        const song = await queue.skip()
        message.channel.send({
            embeds: [new Discord.EmbedBuilder()
            .setColor('#ED4245')
            .setFooter(
                { 
                    text: client.user.tag, 
                    iconURL: client.user.displayAvatarURL({ dynamic: true }) 
                }
            )
            .setTitle("⏭ Skipped the Current Track")
            ]}
        ).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 6000) })
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
    }
  }