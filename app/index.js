const Zcash = require('zcash')
const rpc = new Zcash({
	username: "test",
	password: "test",
	port: "18232"
})

console.log(rpc)

rpc.z_listaddresses().then(info => {
  console.log(info)
})
