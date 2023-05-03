function getScore(requestTopics, positiveTopics) {
  let score = 0
  const sortedTopics = requestTopics.sort((a, b) => {
    if (a.id === 0) return 1
    else if (b.id === 0) return -1
    else return a.id - b.id
  })
  for (let i = 0; i < sortedTopics.length; i++) {
    if (sortedTopics[i].answer == positiveTopics[i].answer) {
      score++
    }
  }
  return score
}

export { getScore }
