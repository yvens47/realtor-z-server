const sendMail = async (to, from, message, subject, transporter) => {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${from}`, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    html: message // html body
  });

  console.log("Message sent: %s", info.messageId);
};

exports.sendMail = sendMail;
