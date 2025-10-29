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
db.query("SELECT DISTINCT u.* FROM Usuarios u JOIN Amigos a ON (a.id_usuario = u.id_usuario AND a.id_amigo = 2) OR (a.id_amigo = u.id_usuario AND a.id_usuario = 2) WHERE u.id_usuario != 2;", (err, results) => {
  if (err) {
    console.error("Error al consultar la base:", err);
  } else {
    console.log(results);
  }
  db.end(); // cerrar conexión
});