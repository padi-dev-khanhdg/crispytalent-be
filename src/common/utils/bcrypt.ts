const bcrypt = require('bcrypt')
const saltRounds = 10

const hash = function (myPlaintextPassword) {
  const salt = bcrypt.genSaltSync(saltRounds)
  return bcrypt.hashSync(myPlaintextPassword, salt)
}

const compare = function (password, hashed) {
  const isPassword = bcrypt.compareSync(password, hashed)
  return isPassword
}
export { hash, compare }
