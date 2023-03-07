const Discord = require('discord.js');

module.exports = {
  name: 'shuffle',
  aliases: ['mix'],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return message.channel.send(
        `❌ ERROR | There is nothing in the queue right now!`
      ).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })

    queue.shuffle();
    
    message.channel
      .send({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor('#ED4245')
            .setFooter({
              text: client.user.tag,
              iconURL: client.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setTitle('🔀 Shuffled the Queue'),
        ],
      })
      .then((msg) => {
        setTimeout(
          () => msg.delete().catch((e) => console.log(e)),
          6000
        );
      });
  },
};
