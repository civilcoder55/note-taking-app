const { nanoid } = require('nanoid');
const { DataTypes } = require('sequelize');
const sequelize = require('../datastores/mysql');
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => `note_${nanoid(10)}`,
    },
    content: {
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
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'title'],
      },
    ],
  }
);

Note.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.user_id;
  delete values.UserId;
  return values;
};

module.exports = Note;
