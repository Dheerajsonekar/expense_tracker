const { v4: uuidv4 } = require('uuid');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ForgotPasswordRequest = require('../models/ForgetPassword');
const path = require('path');

// Brevo (Sendinblue) API key
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SEND_EMAIL_API_KEY;

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(404).json({ msg: 'User not found' });

    const uuid = uuidv4();

    await ForgotPasswordRequest.create({
      _id: uuid,
      userId: userDoc._id,
      isActive: true
    });

    const resetLink = `http://localhost:3000/api/password/resetpassword/${uuid}`;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    await apiInstance.sendTransacEmail({
      to: [{ email }],
      sender: { name: 'Dheeraj', email: 'dheerajsonekar47@gmail.com' },
      subject: 'Reset your password',
      htmlContent: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    });

    res.json({ msg: 'Password reset link sent successfully', resetLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.serveResetForm = async (req, res) => {
  const { uuid } = req.params;

  try {
    const request = await ForgotPasswordRequest.findOne({ _id: uuid, isActive: true });
    if (!request) return res.status(404).send('<h3>Link expired or invalid</h3>');

    res.sendFile(path.join(__dirname, '../public/resetPassword.html'));
  } catch (err) {
    console.error(err);
    res.status(500).send('<h3>Server error</h3>');
  }
};

exports.updatePassword = async (req, res) => {
  const { uuid } = req.params;
  const { newPassword } = req.body;

  try {
    const request = await ForgotPasswordRequest.findOne({ _id: uuid, isActive: true });
    if (!request) return res.status(400).json({ msg: 'Invalid or expired link' });

    const userDoc = await User.findById(request.userId);
    if (!userDoc) return res.status(404).json({ msg: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.updateOne({ _id: userDoc._id }, { $set: { password: hashed } });
    await ForgotPasswordRequest.updateOne({ _id: uuid }, { $set: { isActive: false } });

    res.status(200).json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Something went wrong' });
  }
};
