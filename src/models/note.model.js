const { nanoid } = require('nanoid');
const { DataTypes } = require('sequelize');
const sequelize = require('../datastores/mysql');
const User = require('./user.model');
const cacheHelper = require('../helpers/cache.helper');

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
    priority: {
      type: DataTypes.ENUM,
      values: ['high', 'low'],
    },
    privacy: {
      type: DataTypes.ENUM,
      values: ['public', 'private'],
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
  },
);

Note.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.user_id;
  delete values.UserId;
  return values;
};

// invalidate cache after changes
['afterCreate', 'afterUpdate', 'afterDestroy'].forEach((hookName) => {
  Note.addHook(hookName, (note) => {
    cacheHelper.deleteKey(`notes::${note.user_id}`);
  });
});

module.exports = Note;
