const Discord = require('discord.js')

module.exports = {
    name: 'disconnect',
    aliases: ['disconnect', 'leave', 'dc'],
    inVoiceChannel: true,
    run: async (client, message) => {
        try {
            const voiceChannel = message.member.voice.channel;

            if (!voiceChannel) return message.channel.send(`❌ ERROR | Please join a Channel first`).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })
            client.distube.voices.leave(voiceChannel)
            message.channel.send({
                embeds: [new Discord.EmbedBuilder()
                    .setColor("#ED4245")
                    .setFooter(
                        { 
                            text: client.user.tag, 
                            iconURL: client.user.displayAvatarURL({ dynamic: true }) 
                        }
                    )
                    .setTitle(`Leaving <#${voiceChannel.id}>`)
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
    }
  }