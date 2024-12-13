const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const mysql=require('mysql');
const path = require('path');
require('dotenv').config();
//declaracion de las funciuones de mysql
const {altaUser,buscarUser,nuevaSol,buscarTarea,cambioEstado,tareaCompleta,userCreditos,bestScore}=require('./consultas');
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'clave_secreta';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir los archivos estáticos de Angular
app.use(express.static(path.join(__dirname, 'dist/front-end')));

// Rutas de la aplicación
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/front-end/index.html'));
});



//conexion a la base de datos
const connection =mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"encript",//Nombre de la base de datos
});

connection.connect((err)=>{
  if(err) throw err;
  console.log("Conexion con la base de datos... ");
})


app.post('/bd/sol', (req, res) => {
  const { mensaje, llave, algoritmo } = req.body;
  
  try {
    //console.log('Headers:', req.headers);
    //console.log('Body:', req.body);
    //console.log(mensaje + " " + llave + " " + algoritmo);

    nuevaSol(connection, req.body, result => {
      if (result.error) {
        return res.status(500).send({ error: 'Error al procesar la solicitud' });
      }
      res.send(result);
    });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

app.post('/bd/cambio',(req,res)=>{
  cambioEstado(connection,req.body,result=>{
    if(result.err){
      return res.status(500).send({error:'Falla al procesar la solicitud'});
    }
    res.send(result);
  });
})

app.post('/mostrar/creditos',(req,res)=>{
  console.log(req.body.user);
  userCreditos(connection,req.body,result=>{
    res.json(result);
  })
})

app.get('/mostrar/colaborador',(req,res)=>{
  bestScore(connection,result=>{
    res.json(result);
  })
})

app.post('/bd/completo',(req,res)=>{
  tareaCompleta(connection,req.body,result=>{
    if(result.error){
      return res.status(500).send({error:'Falla en el servidor'})
    }
    res.send(result);
  })
})

app.post('/bd/nuser', (req, res) => {
  console.log('Headers:', req.headers);
  console.log('Body:', req.body); // Esto debería mostrar el cuerpo de la solicitud

  const { user, contra } = req.body;
  if (!user || !contra) {
    return res.status(400).json({ message: 'User y Contra son obligatorios' });
  }

  console.log(user + "  " + contra);
  altaUser(connection, { user: user, contra: contra }, result => {
    res.send(result);
  });
});


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  buscarUser(connection, { user: username }, result => {
      if (result.length === 0) {
          return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      const user = result[0];
      console.log(`Solicitud de: ${username}`);
      console.log('Resultado de la consulta:', result);

      if (!user.passw) {
          console.error('Error: el campo passw está indefinido.');
          return res.status(500).json({ message: 'Error interno del servidor' });
      }

      if (password !==user.passw){
          console.log(password+' '+user.passw);
          console.error('Credenciales incorrectas ...');
          return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      // Crear token
      const token = jwt.sign({ id: user.id, username: user.user }, SECRET_KEY, {
          expiresIn: '1h',
          
      });

      res.json({ token });
      console.log('Se ha iniciado sesion');
  });
});

// Ruta protegida
app.get('/api/protected', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ message: 'Acceso permitido', user: decoded });
    } catch (err) {
        res.status(401).json({ message: 'Token inválido' });
    }
});

app.get('/api/tarea', (req, res) => {
    buscarTarea(connection,result=>{      
      res.json(result);
      })
  });
  
  // Ruta para guardar el texto encriptado
// Ruta para guardar la tarea (texto encriptado)
app.post('/api/tarea', (req, res) => {
    const textoEncriptado = req.body.textoEncriptado;
    console.log("Texto recivido: "+req.body.textoEncriptado);
    // Verificar si el texto encriptado fue enviado correctamente
    if (!textoEncriptado) {
      return res.status(400).json({ error: 'No se proporcionó texto encriptado' });
    }
  
    // Intentar guardar el texto encriptado
    fs.appendFile('tareas_encriptadas.txt', textoEncriptado + '\n', (err) => {
      if (err) {
        console.error('Error al guardar el texto:', err); // Esto ayudará a ver el error en los logs del servidor
        return res.status(500).json({ error: 'No se pudo guardar el texto' });
      }
  
      // Si se guarda correctamente
      res.status(200).json({ mensaje: 'Texto encriptado almacenado correctamente' });
    });
  });
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
