const os = require('os')

// info about current user
const user = os.userInfo()
console.log(user)

// method returns the system uptime in seconds
console.log(`The System Uptime is ${os.uptime()} seconds`)

const currentOS = {
  name: os.type(),
  release: os.release(),
  totalMem: os.totalmem(),
  freeMem: os.freemem(),
  cpuInfo: os.cpus().map((item) => item.times),
}
console.log(JSON.stringify(os.EOL))
// console.log(typeof(os.EOL))
// console.log(os.EOL)



