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
var groups = []
function whatsappBotStart () {
  wa.create().then(client => start(client))

  /**
   * @param {wa.Client} client
   */
  function start (client) {
    client.onMessage(message => {
      if (checkThisMessage(message) && isGrupoCadastrado(message)) {
        sendAnswer(message, client)
      }
      if (message.body.includes('/roll') && isGrupoCadastrado(message)) {
        calculeDices(message, client)
      }
      if (message.body === '/start bot') {
        cadastrarGrupo(message, client)
      }
    })
    readline.on('line', (input) => {
      if (input === 'update') {
        atualizarRespostas()
      }
      readline.prompt()
    })
  }

  function throwDice (sides) {
    return Math.floor(Math.random() * Math.floor(sides)) + 1
  }

  function atualizarRespostas () {
    respostas = getRespostas()
    console.log(respostas)
  }

  function cadastrarGrupo (message, client) {
    groups.push(message.chatId)
    console.log('Bot iniciado' + '->' + message.from)
    client.sendText(message.from, 'Bot iniciado')
  }

  function sendAnswer (message, client) {
    console.log(respostas[message.body] + '->' + message.from)
    client.sendText(message.from, respostas[message.body])
  }

  function calculeDices (message, client) {
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
}
function checkThisMessage (message) {
  return respostas[message.body.toLowerCase()] !== undefined
}

function isGrupoCadastrado (message) {
  return groups.includes(message.chatId)
}

/**
 * @returns {object}
 */
function getRespostas () {
  return JSON.parse(fs.readFileSync('./respostas.json'))
}

exports.whatsappBotStart = whatsappBotStart
