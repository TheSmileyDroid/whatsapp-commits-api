const wa = require('@open-wa/wa-automate')

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
      if (message.body === '###') {
        client.sendText(message.from,
          'O Naruto pode ser um pouco duro às vezes Talvez você não saiba disso Mas o Naruto também Cresceu sem pai Na verdade, ele nunca conheceu nenhum de seus pais ' +
          'E nunca teve nenhum amigo em nossa aldeia Mesmo assim, eu nunca vi ele chorar Ficar zangado ou se dar por vencido Ele está sempre disposto a melhorar' +
          'Ele quer ser respeitado, é o sonho dele E o Naruto daria a vida por isso sem hesitar Meu palpite é que ele se cansou de chorar E decidiu fazer alguma coisa a respeito')
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
  }
}
exports.whatsappBotStart = whatsappBotStart
