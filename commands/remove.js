const Discord = require('discord.js')

module.exports = {
    name: 'remove',
    aliases: ['rm', 'delete'],
    inVoiceChannel: true,
    run: async (client, message, args) => {
      const queue = client.distube.getQueue(message);

      if (!queue) return message.channel.send(`❌ ERROR | There is nothing in the queue right now!`).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })

      if (!args[0]) 
        return message.channel.send(
        `❌ ERROR | Please enter a song index  to remove.`
        ).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })
        
      if (args[0] <= 0) 
          return message.channel.send(
          `❌ ERROR | You can't remove the current song.`
        ).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })

      if (args[1] && args[1] < args[0]) 
        return message.channel.send(
        `❌ ERROR | You need to remove at least 1 song.`
      ).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })

      let song = queue.songs[args[0]];
      const temp = args[1]
      
      if (temp > queue.songs.length - 1) temp = queue.songs.length - 1;

      let amount = temp - args[0] + 1;

      queue.songs.splice(args[0], amount>1 ? amount: 1);
      const text = amount>1? `🔽 Successfully removed ${amount} song${amount > 1 ? "s" : ""}.`: `🔽 Successfully removed **${song.name}**.`
        return message.channel
            .send({
                embeds: [
                new Discord.EmbedBuilder()
                    .setColor('#ED4245')
                    .setFooter({
                        text: client.user.tag,
                        iconURL: client.user.displayAvatarURL({dynamic: true,}),
                    })
                    .setTitle(`${text}`),
                ],
            })
            .then((msg) => {setTimeout(() => msg.delete().catch((e) => console.log(e)), 6000);});
    }
  }