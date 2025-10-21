import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión a MySQL real
const db = mysql.createConnection({
  host: "shinkansen.proxy.rlwy.net",
  user: "root",
  password: "izggSjZVGeSdmNkAbXYVtTmOQOHSlVEV",
  database: "railway",
  port: 24739
});

db.connect(err => {
  if(err) { 
    console.log("Error al conectar a DB:", err); 
    return; 
  }
  console.log("Conectado a MySQL!");
});

// Registro
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if(!username || !password)
    return res.json({ success:false, msg:"Faltan datos" });

  const query = "INSERT INTO Usuarios (Nombre, Contraseña) VALUES (?, ?)";
  db.query(query, [username, password], (err, result) => {
    if(err) {
      console.error(err);
      return res.json({ success:false, msg:"El usuario ya existe o hubo un error" });
    }
    res.json({ success:true, msg:"Usuario registrado con éxito 🎉" });
  });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if(!username || !password)
    return res.json({ success:false, msg:"Faltan datos" });

  const query = "SELECT * FROM Usuarios WHERE Nombre=? AND Contraseña=?";
  db.query(query, [username, password], (err, results) => {
    if(err) {
      console.error(err);
      return res.json({ success:false, msg:"Error en la base de datos" });
    }
    if(results.length > 0)
      res.json({ success:true, msg:"Login correcto" });
    else
      res.json({ success:false, msg:"Usuario o contraseña incorrecta" });
  });
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));