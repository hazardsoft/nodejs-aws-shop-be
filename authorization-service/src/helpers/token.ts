type Token = string

export const delimiter = ':'
export const tokenStart = 'Basic '

export const validate = (token: Token): boolean => {
  return token.startsWith(tokenStart) && token.length > tokenStart.length
}

export const encode = (user: string, password: string): Token => {
  return tokenStart + Buffer.from(`${user}${delimiter}${password}`).toString('base64')
}

export const decode = (token: string): [user: string, password: string] => {
  token = token.replace(tokenStart, '')
  const [user, password] = Buffer.from(token, 'base64').toString().split(delimiter)
  return [user ?? '', password ?? '']
}
