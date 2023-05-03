module.exports = function logicalTopicFactory() {
  const question = `<h1>Question title</h1><div>Description for question</div>`
  let answer = ''
  const characters = '01'
  const charactersLength = characters.length
  for (let i = 0; i < 1; i++) {
    answer += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return {
    question: question,
    answer: answer,
    test_id: 2,
  }
}
