const faker = require('faker');
const Note = require('../../src/models/note.model');

const noteOne = {
  id: 1,
  title: faker.lorem.slug(),
  content: faker.lorem.text(),
  type: faker.random.arrayElement(['work', 'personal']),
};

const noteTwo = {
  id: 2,
  title: faker.lorem.slug(),
  content: faker.lorem.text(),
  type: faker.random.arrayElement(['work', 'personal']),
};

const insertNotes = async (notes) => Note.bulkCreate(notes);

module.exports = {
  noteOne,
  noteTwo,
  insertNotes,
};
