export const getBatch = function* <T>(messages: T[], batchSize: number) {
  for (let i = 0; i < messages.length; i += batchSize) {
    yield messages.slice(i, i + batchSize)
  }
}
