const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: { type: DataTypes.UUID, allowNull: false },
  original_name: { type: DataTypes.STRING(255), allowNull: false },
  stored_name: { type: DataTypes.STRING(255), allowNull: false },
  file_size: { type: DataTypes.INTEGER },
  mime_type: { type: DataTypes.STRING(100) },
  encrypted: { type: DataTypes.BOOLEAN, defaultValue: true },
  hash: { type: DataTypes.STRING(64), allowNull: false },
  signature: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'documents',
  timestamps: true,
  createdAt: 'uploaded_at',
  updatedAt: false,
});

User.hasMany(Document, { foreignKey: 'user_id' });
Document.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Document;