function getTopic(topics: any, test_id: number) {
  let topicArr
  switch (test_id) {
    case 1:
      const memoryObj = {}
      const memoryArr = []
      let sumIndex = 0
      for (let i = 0; i < topics.length; i++) {
        memoryObj[topics[i].answer.length] = !memoryObj[topics[i].answer.length]
          ? 1
          : memoryObj[topics[i].answer.length] + 1
      }
      for (let i = 1; i <= 32; i++) {
        const topicIndex =
          Math.floor(Math.random() * memoryObj[topics[i - 1].answer.length]) + sumIndex
        sumIndex += memoryObj[topics[i - 1].answer.length]
        memoryArr.push(topics[topicIndex])
      }
      topicArr = memoryArr
      break
    case 2:
      const logicalObj = {
        no: 0,
        yes: 0,
      }
      const logicalArr = []
      while (logicalObj['no'] < 10 || logicalObj['yes'] < 10) {
        const topicIndex = Math.floor(Math.random() * 107)
        if (logicalArr.length >= 3) {
          const temp = logicalArr.slice(logicalArr.length - 3, logicalArr.length)
          if (temp.every((item) => parseInt(item.answer) == topics[topicIndex].answer) == true) {
            continue
          }
        }
        if (logicalObj[topics[topicIndex].id] != true) {
          if (topics[topicIndex].answer == '0' && logicalObj['no'] < 10) {
            if (logicalObj['no'] - logicalObj['yes'] < 3) {
              logicalObj[topics[topicIndex].id] = true
              logicalObj['no'] = logicalObj['no'] + 1
              logicalArr.push(topics[topicIndex])
            }
          } else if (topics[topicIndex].answer == '1' && logicalObj['yes'] < 10) {
            if (logicalObj['yes'] - logicalObj['no'] < 3) {
              logicalObj[topics[topicIndex].id] = true
              logicalObj['yes'] = logicalObj['yes'] + 1
              logicalArr.push(topics[topicIndex])
            }
          }
        } else {
          continue
        }
      }
      topicArr = logicalArr
      break
    default:
      return []
  }
  return topicArr
}

export { getTopic }
