const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'clave_secreta';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simular base de datos
const users = [
    { id: 1, username: 'user', password: bcrypt.hashSync('flath', 10) },
    { id: 2, username: 'user2', password: bcrypt.hashSync('password2', 10) },
    { id: 3, username: 'saul', password: bcrypt.hashSync('force', 10) }
];

// Ruta para iniciar sesión
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    console.log(`Solicitud de:  ${username}`);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Crear token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
        expiresIn: '1h',
    });

    res.json({ token });
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
    const texto = "Texto a encriptar en el cliente";
    res.json({ texto });
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
