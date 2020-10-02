const wa = require('@open-wa/wa-automate')
const fs = require('fs')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
/**
 * @type {object}
 */
var respostas = getRespostas()
function whatsappBotStart () {
  wa.create().then(client => start(client))

  function throwDice (sides) {
    return Math.floor(Math.random() * Math.floor(sides)) + 1
  }

  /**
   * @param {wa.Client} client
   */
  function start (client) {
    client.onMessage(message => {
      if (respostas[message.body.toLowerCase] !== undefined) {
        client.sendText(message.from, respostas[message.body])
      }
      if (message.body.includes('/roll')) {
        var value = 'resultados: '
        var numbers = message.body.slice(5).split('d')
        var numberDices = numbers[0]
        if (numberDices >= 100) {
          value += 'vai tomar no cu'
          console.log(message)
          console.log(value)
          client.sendText(message.chatId, value)
        } else {
          var numberSides = numbers[1]
          for (let dice = 0; dice < numberDices; dice++) {
            value += throwDice(numberSides) + ', '
          }
          console.log(message)
          console.log(value)
          client.sendText(message.chatId, value)
        }
      }
    })
    readline.on('line', (input) => {
      if (input === 'update') {
        respostas = getRespostas()
        console.log(respostas)
      }
      readline.prompt()
    })
  }
}
/**
 * @returns {object}
 */
function getRespostas () {
  return JSON.parse(fs.readFileSync('./respostas.json'))
}

exports.whatsappBotStart = whatsappBotStart
