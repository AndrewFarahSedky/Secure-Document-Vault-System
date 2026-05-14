const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password', 'two_factor_secret'] } });
  res.json({ users });
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.update({ role });
  res.json({ message: 'Role updated', user });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.destroy();
  res.json({ message: 'User deleted' });
};