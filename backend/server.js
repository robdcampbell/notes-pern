const express = require("express");
const app = express();
const PORT = 5000;
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(express.json()); // allows access to req (req.body, req.params, etc...)
app.use(cors()); // allows cross domain resource sharing - proxing between ports 3000 and 5000 here

// ROUTES //

// Get all todos
app.get("/todos", async (req, res) => {
  const allTodos = await pool.query("SELECT * FROM todo");
  res.status(200).json(allTodos.rows);
});

// get a specific todo
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id=($1)", [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// create a todo

app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    res.status(200).json(newTodo.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// update a todo

// delete a todo

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Pterodactyl" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port:${PORT}`);
});
