function arraysTestInclude(a, b) {
  return b.every((i) => a.includes(i))
}

export { arraysTestInclude }
