const fs = require('fs')
module.exports = (client) => {
    try {
        fs.readdir('./commands/', (err, files) => {
            if (err) return console.log('Could not find any commands!')
            const jsFiles = files.filter(f => f.split('.').pop() === 'js')
            if (jsFiles.length <= 0) return console.log('Could not find any commands!')
            jsFiles.forEach(file => {
              const cmd = require(`../commands/${file}`)
              client.commands.set(cmd.name, cmd)
              if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
            })
          })
    } catch (e) {
        console.log('fs', e);
    }
};