module.exports = function memoryTopicFactory(level) {
  let answer = ''
  const characters = '01'
  const charactersLength = characters.length
  for (let i = 0; i < level; i++) {
    answer += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  const question = `<h1>Question level ${level}</h1><div>${answer}</div>`

  return {
    question: question,
    answer: answer,
    test_id: 1,
  }
}
