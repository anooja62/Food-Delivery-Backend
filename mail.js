const nodemailer = require('nodemailer');
const fs = require('fs');


let mailTransporter = nodemailer.createTransport({
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
	//text: 'Welcome to deliorder '
    html: fs.readFileSync('emailHTML.txt','utf8')
  

};

mailTransporter.sendMail(mailDetails, function(err, data) {
	if(err) {
		console.log(err);
	} else {
		console.log('Email sent successfully');
	}
});