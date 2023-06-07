const { readFileSync, writeFileSync } = require('fs')
console.log('start')
const first = readFileSync('./content/first.txt', 'utf8')
const second = readFileSync('./content/second.txt', 'utf8')

writeFileSync(
  /* is the the file doesn't exist it will be created, and if it exists node will overwrite 
  the current file content for the new one */

  './content/result-sync.txt',
  `Here is the result : ${first}, ${second}`,

  /* node will append next content and not overwrite it with options object flag: 'a' */

  { flag: 'a' }
)
console.log('done with this task')
console.log('starting the next one')
