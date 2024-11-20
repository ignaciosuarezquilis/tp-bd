const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');


app.use(cors());


// Configuración de la base de datos
const config = {
  user: 'sa',
  password: 'hola123',
  server: 'localhost',  // o 'localhost\\SQLEXPRESS' si es necesario
  database: 'HOSPITAL_GRUPO1',
  options: {
    encrypt: false, // Utiliza esto si estás utilizando una conexión cifrada
    trustServerCertificate: true, // Solo para desarrollo
  }
};


// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Conexión a la base de datos cuando el servidor inicie
let pool;
sql.connect(config)
  .then((p) => {
    pool = p;
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Detener el servidor si no se puede conectar a la base de datos
  });

// Ruta para obtener todos los médicos
app.get('/medicos', async (req, res) => {
  try {
    console.log("Obteniendo medicos");
    const result = await pool.request().query('SELECT * FROM dbo.MEDICO');
    
    // Convertir el campo 'foto' de Buffer a base64
    const medicos = result.recordset.map(medico => {
      // Si 'foto' tiene datos (no está vacío), convertirla a base64
      if (medico.foto && medico.foto.data && medico.foto.data.length > 0) {
        medico.foto = `data:image/jpeg;base64,${medico.foto.data.toString('base64')}`;
      } else {
        medico.foto = null;  // Si no hay foto, asignar null
      }
      return medico;
    });

    res.json(medicos);
  } catch (err) {
    console.error('Error al obtener médicos:', err);
    res.status(500).send('Error al obtener médicos');
  }
});

// Ruta para agregar un nuevo médico
app.post('/medicos', async (req, res) => {
  const { apellido, nombre, dni_medico, cant_dispuesto, fecha_ingreso, CUIL_CUIT } = req.body;
  try {
    const query = `INSERT INTO dbo.MEDICO (apellido, nombre, dni_medico, cant_dispuesto, fecha_ingreso, CUIL_CUIT) 
                   VALUES ('${apellido}', '${nombre}', '${dni_medico}', ${cant_dispuesto}, '${fecha_ingreso}', '${CUIL_CUIT}')`;
    await pool.request().query(query);
    res.status(201).send('Médico agregado correctamente');
  } catch (err) {
    console.error('Error al agregar médico:', err);
    res.status(500).send('Error al agregar médico');
  }
});

// Ruta para actualizar un médico
app.put('/medicos/:matricula', async (req, res) => {
  const { matricula } = req.params;
  const { apellido, nombre, dni_medico, cant_dispuesto, fecha_ingreso, CUIL_CUIT } = req.body;
  try {
    const query = `UPDATE dbo.MEDICO
                   SET apellido = '${apellido}', nombre = '${nombre}', dni_medico = '${dni_medico}', 
                       cant_dispuesto = ${cant_dispuesto}, fecha_ingreso = '${fecha_ingreso}', CUIL_CUIT = '${CUIL_CUIT}'
                   WHERE matricula = ${matricula}`;
    await pool.request().query(query);
    res.send('Médico actualizado correctamente');
  } catch (err) {
    console.error('Error al actualizar médico:', err);
    res.status(500).send('Error al actualizar médico');
  }
});

// Ruta para eliminar un médico
app.delete('/medicos/:matricula', async (req, res) => {
  const { matricula } = req.params;
  try {
    const query = `DELETE FROM dbo.MEDICO WHERE matricula = ${matricula}`;
    await pool.request().query(query);
    res.send('Médico eliminado correctamente');
  } catch (err) {
    console.error('Error al eliminar médico:', err);
    res.status(500).send('Error al eliminar médico');
  }
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
