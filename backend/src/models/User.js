const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: { 
    type: DataTypes.STRING(50), 
    unique: true, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(100), 
    unique: true, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING(255) 
  },
  role: { 
    type: DataTypes.STRING(20),
    defaultValue: 'user',
    validate: {
      isIn: [['admin', 'manager', 'user']]
    }
  },
  oauth_provider: { 
    type: DataTypes.STRING(20) 
  },
  oauth_id: { 
    type: DataTypes.STRING(100) 
  },
  two_factor_secret: { 
    type: DataTypes.STRING(100) 
  },
  two_factor_enabled: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = User;