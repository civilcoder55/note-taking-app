const { DataTypes } = require('sequelize');
const sequelize = require('../databases/mysql');
const User = require('./user.model');

const Note = sequelize.define(
  'Note',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['personal', 'work'],
    },
  },
  {
    underscored: true,
  }
);

module.exports = Note;
