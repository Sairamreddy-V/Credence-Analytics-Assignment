const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const filePath = path.join(__dirname, '/database/database.db');

let db;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: filePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server Running on port 3000...`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
  }
};

initializeDbAndServer();

// Getting all the details from the table
app.get('/', async (request, response) => {
  const getAllDetailsQuery = `
    SELECT 
      *
    FROM 
      books_table
  `;
  try {
    const details = await db.all(getAllDetailsQuery);
    response.status(200).json({ details });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// Adding a Book/Poetry to the table
app.post('/add', async (request, response) => {
  const { name, image, summary } = request.body;
  const insertQuery = `
    INSERT INTO 
      books_table (name, img, summary)
    VALUES
      ('${name}','${image}', '${summary}')
  `;
  try {
    await db.run(insertQuery);
    response.status(200).send('Added Successfully');
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// Updating a specified book/poetry in the table using id
app.put('/update/:id', async (request, response) => {
  const { name, image, summary } = request.body;
  const { id } = request.params;
  const updateQuery = `
    UPDATE 
      books_table
    SET 
      name = '${name}', img ='${image}', summary = '${summary}'
    WHERE 
      id = ${id}
  `;
  try {
    await db.run(updateQuery, [name, image, summary, id]);
    response.status(200).send('Updated Successfully');
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// Deleting a specified book/poetry in the table using id
app.delete('/delete/:id', async (request, response) => {
  const { id } = request.params;
  const deleteQuery = `
    DELETE FROM 
      books_table
    WHERE 
      id = ${id}
  `;
  try {
    await db.run(deleteQuery, id);
    response.status(200).send('Deleted Successfully');
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});
