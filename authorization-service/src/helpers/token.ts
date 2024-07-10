type Token = string

const delimiter = ':'

export const encodeToken = (user: string, password: string): Token => {
  return Buffer.from(`${user}${delimiter}${password}`).toString('base64')
}

export const decodeToken = (token: string): [user: string, password: string] => {
  const [user, password] = Buffer.from(token, 'base64').toString().split(delimiter)
  return [user ?? '', password ?? '']
}
