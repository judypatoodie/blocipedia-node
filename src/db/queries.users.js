const User = require("./models").User;
require("dotenv").config();
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY ='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';
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = {

  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword,
      userId: newUser.id
    })
    .then((user) => {
      const msg = {
        to: newUser.email,
        from: 'info@blocipedia.com',
        subject: 'Welcome to Blocipedia',
        text: 'Thank you for signing up - start sharing your knowledge with other members in the community!',
        html: '<strong>Let the writing begin!</strong>',
      };
      sgMail.send(msg);
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  upgrade(id, callback){
    return User.findById(id)
    .then((user) => {
      if(!user){
        return callback("User does not exist!");
      } else {
        return user.updateAttributes({role: "premium"});
      }
    }) .catch((err) => {
      callback(err);
    })
  },

  downgrade(id, callback){
     return User.findById(id)
     .then((user) => {
       if(!user){
         return callback("User does not exist!");
       } else {
         return user.updateAttributes({role: "standard"});
       }
     }) .catch((err) => {
       callback(err);
     })
  }


}
