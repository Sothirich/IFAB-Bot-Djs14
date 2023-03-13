const { DisTube } = require('distube')
const Discord = require('discord.js')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const { DeezerPlugin } = require("@distube/deezer");
require('dotenv').config();

module.exports = (client) => {
  client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    // emitAddListWhenCreatingQueue: false,
    youtubeCookie: process.env.Cookie,
    youtubeIdentityToken: process.env.identityToken,
    plugins: [
        new SpotifyPlugin({
            parallel: false,
            api: {
                clientId: process.env.SpotifyID,
                clientSecret: process.env.SpotifySecret,
                topTracksCountry: "KH",
            },
        }),
        new YtDlpPlugin({
            update: true
        }),
        new SoundCloudPlugin(),
        new DeezerPlugin(),
    ],
    // youtubeCookie --> prevents ERRORCODE: "429"
  });

  const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
 
  client.distube
    .on('playSong', (queue, song) =>queue.textChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
            .setTitle("Playing :notes: " + song.name)
            .setURL(song.url)
            .setColor('#ED4245')
            .addFields(
                {
                    name: "Duration",
                    value: `\`${song.formattedDuration}\``
                },
                {
                    name: "QueueStatus",
                    value: `${status(queue)}`
                },
            )
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Requested by: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })
        ]
    }).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), (song.duration + "000")) }))

    .on('addSong', (queue, song) =>queue.textChannel.send({
        embeds: [new Discord.EmbedBuilder()
            .setTitle("Added :thumbsup: " + song.name)
            .setURL(song.url)
            .setColor("#ED4245")
            .addFields(
                {
                    name: `${queue.songs.length - 1} Songs in the Queue`,
                    value: `Duration: \`${queue.formattedDuration}\``
                },
                {
                    name: "Duration",
                    value: `\`${song.formattedDuration}\``
                },
            )
            .setThumbnail(song.thumbnail)
            .setFooter(
                { 
                    text: `Requested by: ${song.user.tag}`, 
                    iconURL: song.user.displayAvatarURL({ dynamic: true }) 
                }
            )
        ]
    }).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 10000) }))

    .on("playList", (queue, playlist, song) => queue.textChannel.send({
        embeds: [new Discord.EmbedBuilder()
            .setTitle("Playing Playlist :notes: " + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
            .setURL(playlist.url)
            .setColor("#ED4245")
            .addFields(
                {
                    name: "Current Track:",
                    value: `[${song.name}](${song.url})`
                },
                {
                    name: "Duration",
                    value: `\`${playlist.formattedDuration}\``
                },
                {
                    name: `${queue.songs.length} Songs in the Queue`,
                    value: `Duration: \`${format(queue.duration * 1000)}\``
                },
            )
            .setThumbnail(playlist.thumbnail.url)
            .setFooter({ text: `Requested by: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })
        ]
    }).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), (song.duration + "000")) }))
    
    .on('addList', (queue, playlist) => queue.textChannel.send({
        embeds: [new Discord.EmbedBuilder()
            .setTitle("Added Playlist :thumbsup: " + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
            .setURL(playlist.url)
            .setColor("#ED4245")
            .addFields(
                {
                    name: "Duration",
                    value: `\`${playlist.formattedDuration}\``
                },
                {
                    name: `${queue.songs.length - 1} Songs in the Queue`,
                    value: `Duration: \`${queue.formattedDuration}\``
                },
            )
            .setThumbnail(playlist.thumbnail.url)
        ]
    }).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 20000) })
    )

    .on('error', (channel, e) => {
        channel.send(`🛑 An ERROR encountered:\n ${e.toString().slice(0, 1974)}`)
        console.error(e)
    })

    .on('empty', queue => queue.textChannel.send('Voice channel is empty! Leaving the channel...')
        .then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 5000) })
    )

    .on("initQueue", queue => {
        queue.autoplay = true;
        queue.volume = 100;
      })
};
