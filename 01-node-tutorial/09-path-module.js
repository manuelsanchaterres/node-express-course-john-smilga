const path = require('path')

console.log(path.sep)

const filePath = path.join('/content/', 'subfolder', 'test.txt')
console.log(filePath)

const fileName = path.basename(filePath)
console.log(fileName)

// const absolute = path.resolve(__dirname, 'content', 'subfolder', 'test.txt')
const absolutePath = path.resolve(__dirname, 'content', 'subfolder', 'test.txt')

console.log(absolutePath)
