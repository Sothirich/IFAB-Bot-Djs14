const Discord = require('discord.js')

module.exports = {
    name: 'queue',
    aliases: ['q'],
    run: async (client, message) => {
      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send(`❌ ERROR | There is nothing in the queue right now!`).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 4000) })

      let currentPage = 0;
      let length = queue.songs.length - 1;

      let lastPage = 0;
      if (length % 10 == 0) lastPage = Math.floor(length / 10);
      else lastPage = (Math.floor(length / 10) + 1);

      if (length == 0)
        return message.channel
            .send({
                embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(`🎶 Queue: 0`)
                    .setColor('#ED4245')
                    .setDescription(`__Now Playing:__\n${queue.songs.map(song => `**[${song.name}](${song.url})** | \`${song.formattedDuration}\` | \`Requested By: ${song.user.tag}\``).slice(0, 1).join("\n")}\n`)
                    .setFooter({text: 'Page: 0'})
                ],
            })
            .then((msg) => {setTimeout(() => msg.delete().catch((e) => console.log(e)), 30000);});

      const embeds = [];
        let k = 0;
        for (let i = 0; i < queue.songs.length; i += 10) {
            k += 10;
            const info = queue.songs.map((song, id) => `**${id}**. **[${song.name}](${song.url})** | \`${song.formattedDuration}\` | \`Requested By: ${song.user.tag}\``).slice(i + 1, k + 1).join("\n");
            const embed = new Discord.EmbedBuilder()
                .setTitle(`🎶 Queue: ${queue.songs.length - 1}`)
                .setColor('#ED4245')
                .setDescription(`__Now Playing:__\n${queue.songs.map(song => `**[${song.name}](${song.url})** | \`${song.formattedDuration}\` | \`Requested By: ${song.user.tag}\``).slice(0, 1).join("\n")}\n\n__Up Next:__\n${info}\n`)
                .setFooter({text: `Page: ${k/10} of ${lastPage}`})
        embeds.push(embed);
      }

      message.channel.send({embeds: [embeds[currentPage]]}).then(msg => {
            msg.react('⬅️').then(() => msg.react('➡️'));
            setTimeout(() => msg.delete().catch(e => console.log(e)), 60 * 1000);

            const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
            const collector = msg.createReactionCollector({ filter, time: 60000 });

            collector.on('collect', async (reaction, user) => {
                reaction.users.remove(user)

                if (reaction.emoji.name === '⬅️') {
                    if (currentPage == 0) currentPage = lastPage - 1;
                    else currentPage--;
                    await msg.edit({embeds: [embeds[currentPage]]});
                } else if (reaction.emoji.name === '➡️') {
                    if (currentPage == lastPage - 1) currentPage = 0;
                    else currentPage++;
                    await msg.edit({embeds: [embeds[currentPage]]});
                }
            });
        });
    }
  }