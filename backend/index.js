


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
    if(results.length > 0) {
      // Enviamos info del usuario para el front
      const user = results[0];
      res.json({ 
        success: true, 
        msg: "Login correcto", 
        user: { nombre: user.Nombre, id: user.id_usuario } 
      });

      console.log("Campos del usuario:", results[0]);

      console.log("Usuario que se va a enviar al frontend:", {
        nombre: user.nombre,
        id: user.id_usuario
      });
      
    } else {
      res.json({ success:false, msg:"Usuario o contraseña incorrecta" });
    }
  });
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));





//Eventos
// Endpoint para traer eventos de un usuario
app.get("/eventos/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = "SELECT e.* FROM Eventos e JOIN `UsuarioEventos` ue ON e.ID_Evento = ue.ID_Evento WHERE ue.ID_Usuario = ?";
    db.query(query, [userId], (err, results) => {
        if(err){
            console.error(err);
            return res.json({ success: false, eventos: [] });
        }
        res.json({ success: true, eventos: results });
    });
});

// Crear evento y asignarlo a un usuario
app.post("/crear_evento", (req, res) => {
  const { nombre_evento, descripcion, ubicacion, fecha_inicio, fecha_fin, userId} = req.body; 

  // 1️ Insertar en Eventos
  const queryEvento = "INSERT INTO Eventos (nombre, descripcion, ubicacion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)";
  db.query(queryEvento, [nombre_evento, descripcion, ubicacion, fecha_inicio, fecha_fin], (err, result) => {
    if(err) {
      console.error(err);
      return res.json({ success:false, msg:"Hubo un error al crear el evento" });
    }

    const nuevoEventoId = result.insertId; // 🔹 ID del evento recién creado

    // 2️ Insertar en UsuarioEventos para vincularlo al usuario
    const queryUsuarioEvento = "INSERT INTO UsuarioEventos (id_usuario, id_evento, Estado) VALUES (?, ?, ?)";
    db.query(queryUsuarioEvento, [userId, nuevoEventoId, "Activo"], (err2, result2) => {
      if(err2) {
        console.error(err2);
        return res.json({ success:false, msg:"Error al asignar el evento al usuario" });
      }

      res.json({ success:true, msg:"Evento creado y asignado al usuario 🎉" });
    });
  });
});

// Añadir usuario a evento
app.post("/aniadir_a_evento", (req, res) => {
  const { id_usuario, id_evento, estado} = req.body; 
  
  const query = "INSERT INTO UsuarioEventos (id_usuario, id_evento, estado) VALUES (?, ?, ?)";
  db.query(query, [id_usuario, id_evento, estado], (err, result) => {
    if(err) {
      console.error(err);
      return res.json({ success:false, msg:"Hubo un error al añadir al usuario el evento" });
    }
    res.json({ success:true, msg:"Usuario añadido al Evento con exito 🎉" });
  });
});



//AMIGOS
// Mostrar Usuarios no amigos
app.get("/solicitudes/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = "SELECT u.* FROM Usuarios u LEFT JOIN Amigos a ON (u.id_usuario = a.id_usuario AND a.id_amigo = ?) OR (u.id_usuario = a.id_amigo AND a.id_usuario = ?) WHERE a.id_usuario IS NULL AND u.id_usuario != ?;";
    db.query(query, [userId,userId,userId], (err, results) => {
        if(err){
            console.error(err);
            return res.json({ success: false, Solicitudes_pendientes: [] });
        }
        res.json({ success: true, Solicitudes_pendientes: results });
    });
});

// Mostrar Amigos
app.get("/amigos/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = "SELECT DISTINCT u.id_usuario, u.nombre FROM Usuarios u JOIN Amigos a ON (a.id_usuario = ? AND a.id_amigo = u.id_usuario) OR (a.id_amigo = ? AND a.id_usuario = u.id_usuario) WHERE u.id_usuario != ?;";
    db.query(query, [userId,userId,userId], (err, results) => {
        if(err){
            console.error(err);
            return res.json({ success: false, amigos: [] });
        }
        res.json({ success: true, amigos: results });
    });
});

// Solicitud Amistad
app.post("/Solicitud_Amistad", (req, res) => {
  const { id, other_id } = req.body; //Recibe la id propia y la id de la otra persona
  
  const query = "INSERT INTO Amigos (id_usuario, id_amigo, estado) VALUES (?, ?, 'Pendiente')";
  db.query(query, [id, other_id], (err, result) => {
    if(err) {
      console.error(err);
      return res.json({ success:false, msg:"Hubo un error con la solicitud de amistad" });
    }
    res.json({ success:true, msg:"Solicitud de Amistad enviada 🎉" });
  });
});

// Aceptar Solicitud Amistad
app.post("/Aceptar solicitud", (req, res) => {
  const { amigo_id } = req.body; //Recibe la id de la amistad
  
  const query = "UPDATE Amigos SET estado = 'Aceptado' WHERE id_amigos = ?";
  db.query(query, [amigo_id], (err, result) => {
    if(err) {
      console.error(err);
      return res.json({ success:false, msg:"Hubo un error al aceptar la amistad" });
    }
    res.json({ success:true, msg:"Amistad aceptada 🎉" });
  });
});

// Rechazar Solicitud Amistad
app.post("/Aceptar_solicitud", (req, res) => {
  const { amigo_id } = req.body; //Recibe la id de la amistad
  
  const query = "DELETE FROM Amigos WHERE id_amigos = ?";
  db.query(query, [amigo_id], (err, result) => {
    if(err) {
      console.error(err);
      return res.json({ success:false, msg:"Hubo un error al rechazar la amistad" });
    }
    res.json({ success:true, msg:"Amistad rechazada" });
  });
});

// Mostrar Solicitudes de Amistad
app.get("/solicitudes/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = "SELECT * FROM Amigos WHERE id_amigo = ?";
    db.query(query, [userId], (err, results) => {
        if(err){
            console.error(err);
            return res.json({ success: false, Solicitudes_pendientes: [] });
        }
        res.json({ success: true, Solicitudes_pendientes: results });
    });
});




