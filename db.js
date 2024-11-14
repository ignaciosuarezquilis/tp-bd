const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const app = express();


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

sql.connect(config).then(() => {
  console.log("Conexión exitosa a la base de datos.");
  return sql.query('SELECT * FROM dbo.MEDICO');
}).then(result => {
  console.log(result.recordset); 
}).catch(err => {
  console.error("Error de conexión: ", err);
});
