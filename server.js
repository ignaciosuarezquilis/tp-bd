const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sql, poolPromise } = require("./db");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Obtener listado de médicos
app.get("/api/medicos", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Medicos");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Agregar un nuevo médico
app.post("/api/medicos", async (req, res) => {
  try {
    const { nombre, especialidad, telefono, email } = req.body;
    const pool = await poolPromise;
    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("especialidad", sql.VarChar, especialidad)
      .input("telefono", sql.VarChar, telefono)
      .input("email", sql.VarChar, email)
      .query("INSERT INTO Medicos (nombre, especialidad, telefono, email) VALUES (@nombre, @especialidad, @telefono, @email)");
    res.send("Médico agregado");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Otras rutas CRUD para camas, visitas y guardias aquí...

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
