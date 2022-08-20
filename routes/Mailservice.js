const router = require("express").Router();
const nodemailer = require('nodemailer');
//const fs = require('fs');

router.put("/sendemail",async (req,res) => {
	try{
let mailTransporter = await nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'deliorderfoods@gmail.com',
		pass: 'gkwrwlnhlwsfwopr'
	}
});
	

let mailDetails = {
	from: 'deliorderfoods@gmail.com',
	to: 'anooja4545@gmail.com',
	subject: 'Hello Anu',
	text: 'Welcome to deliorder '
    //html: fs.readFileSync('emailHTML.txt','utf8')
  

};
	}catch(err) {
		res.status(500).json(err);
		console.log(err);
	}
});


module.exports = router;