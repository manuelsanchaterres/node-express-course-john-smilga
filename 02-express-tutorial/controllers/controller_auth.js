const loginUser = (req, res) => {

  console.log(req.body.name);
    const { name } = req.body
    if (name) {
      return res.status(200).send(`Wellcome ${name}`)
    }
  
    res.status(401).send('Please Provide Credentials')

}

module.exports = {loginUser}