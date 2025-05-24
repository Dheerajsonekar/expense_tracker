const { v4: uuidv4 } = require('uuid');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const ForgotPasswordRequest = require('../models/ForgetPassword')
const path = require('path');
const { Op } = require('sequelize');

// setup Brevo (Sendinblue)
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey =process.env.SEND_EMAIL_API_KEY;

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const users = await user.findOne({ where: { email } });
    if (!users) return res.status(404).json({ msg: 'User not found' });

    const uuid = uuidv4();
    await ForgotPasswordRequest.create({ id: uuid, userId: users.id });

    const resetLink = `http://localhost:3000/api/password/resetpassword/${uuid}`;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    await apiInstance.sendTransacEmail({
      to: [{ email }],
      sender: { name: 'Dheeraj', email: 'dheerajsonekar47@gmail.com' },
      subject: 'Reset your password',
      htmlContent: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    });

    res.json({ msg: resetLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.serveResetForm = async (req, res) => {
  const { uuid } = req.params;
  const request = await ForgotPasswordRequest.findOne({ where: { id: uuid, isActive: true } });

  if (!request) {
    return res.status(404).send('<h3>Link expired or invalid</h3>');
  }

  res.sendFile(path.join(__dirname, '../../frontend/forms/resetPassword.html'));
};

exports.updatePassword = async (req, res) => {
  const { uuid } = req.params;
  const { newPassword } = req.body;

  try {
    const request = await ForgotPasswordRequest.findOne({
      where: { id: uuid, isActive: true },
      include: user
    });

    if (!request) return res.status(400).json({ msg: 'Invalid or expired link' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await request.user.update({ password: hashed });
    await request.update({ isActive: false });

    res.status(200).json({ msg: 'Password updated successfully' });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Something went wrong' });
  }
};
