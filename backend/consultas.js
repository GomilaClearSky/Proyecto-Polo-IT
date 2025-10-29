// ESTE ES UN ARCHIVO DE PRUEBAS PARA CONSULTAS
// NO LO EDITÉS NI LE DES BOLA LAUTI




const mysql = require("mysql2");

// Conexión a tu base en Railway
const db = mysql.createConnection({
  host: "shinkansen.proxy.rlwy.net",
  user: "root",
  password: "izggSjZVGeSdmNkAbXYVtTmOQOHSlVEV",
  database: "railway",
  port: 24739
});

// Hacer una consulta simple
db.query("SELECT * FROM UsuarioEventos", (err, results) => {
  if (err) {
    console.error("Error al consultar la base:", err);
  } else {
    console.log(results);
  }
  db.end(); // cerrar conexión
});