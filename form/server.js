// server.js - Backend Completo Sin MongoDB
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================
// BASE DE DATOS EN MEMORIA
// ============================================
let usuarios = [];
let nextId = 1;

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================
const validarUsuario = (usuario) => {
  const errores = [];
  
  // Validar DNI
  if (!usuario.dni) {
    errores.push('El DNI es obligatorio');
  } else if (usuario.dni.length !== 10) {
    errores.push('El DNI debe tener exactamente 10 caracteres');
  }
  
  // Validar nombres
  if (!usuario.nombres || !usuario.nombres.trim()) {
    errores.push('Los nombres son obligatorios');
  }
  
  // Validar apellidos
  if (!usuario.apellidos || !usuario.apellidos.trim()) {
    errores.push('Los apellidos son obligatorios');
  }
  
  // Validar fecha de nacimiento
  if (!usuario.fechaNacimiento) {
    errores.push('La fecha de nacimiento es obligatoria');
  }
  
  // Validar género
  if (!usuario.genero) {
    errores.push('El género es obligatorio');
  } else if (!['masculino', 'femenino', 'otro'].includes(usuario.genero)) {
    errores.push('Género no válido');
  }
  
  // Validar ciudad
  if (!usuario.ciudad) {
    errores.push('La ciudad es obligatoria');
  }
  
  return errores;
};

// ============================================
// RUTAS - CRUD
// ============================================

// CREATE - Crear nuevo usuario
app.post('/api/usuarios', (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' POST /api/usuarios');
  console.log('Datos recibidos:', req.body);
  
  try {
    // Validar datos
    const errores = validarUsuario(req.body);
    
    if (errores.length > 0) {
      console.log(' Errores de validación:', errores);
      return res.status(400).json({ 
        error: errores.join(', '),
        detalles: errores 
      });
    }
    
    // Verificar DNI único
    const dniExiste = usuarios.find(u => u.dni === req.body.dni);
    if (dniExiste) {
      console.log(' DNI duplicado:', req.body.dni);
      return res.status(400).json({ error: 'El DNI ya existe' });
    }
    
    // Crear usuario
    const nuevoUsuario = {
      _id: nextId.toString(),
      dni: req.body.dni,
      nombres: req.body.nombres.trim(),
      apellidos: req.body.apellidos.trim(),
      fechaNacimiento: req.body.fechaNacimiento,
      genero: req.body.genero,
      ciudad: req.body.ciudad,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    nextId++;
    usuarios.push(nuevoUsuario);
    
    console.log(' Usuario creado exitosamente');
    console.log('ID:', nuevoUsuario._id);
    console.log('Total usuarios:', usuarios.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: nuevoUsuario
    });
    
  } catch (error) {
    console.error(' Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// READ - Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('GET /api/usuarios');
  console.log('Enviando', usuarios.length, 'usuarios');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  res.json(usuarios);
});

// READ - Obtener un usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 GET /api/usuarios/' + req.params.id);
  
  const usuario = usuarios.find(u => u._id === req.params.id);
  
  if (!usuario) {
    console.log('Usuario no encontrado');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  console.log('Usuario encontrado:', usuario.nombres, usuario.apellidos);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  res.json(usuario);
});

// UPDATE - Actualizar usuario
app.put('/api/usuarios/:id', (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('PUT /api/usuarios/' + req.params.id);
  console.log('Datos a actualizar:', req.body);
  
  try {
    const index = usuarios.findIndex(u => u._id === req.params.id);
    
    if (index === -1) {
      console.log('Usuario no encontrado');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Validar datos
    const errores = validarUsuario(req.body);
    
    if (errores.length > 0) {
      console.log('Errores de validación:', errores);
      return res.status(400).json({ 
        error: errores.join(', '),
        detalles: errores 
      });
    }
    
    // Verificar DNI único (excepto el usuario actual)
    const dniExiste = usuarios.find(u => 
      u.dni === req.body.dni && u._id !== req.params.id
    );
    
    if (dniExiste) {
      console.log('DNI duplicado:', req.body.dni);
      return res.status(400).json({ error: 'El DNI ya existe' });
    }
    
    // Actualizar usuario
    usuarios[index] = {
      ...usuarios[index],
      dni: req.body.dni,
      nombres: req.body.nombres.trim(),
      apellidos: req.body.apellidos.trim(),
      fechaNacimiento: req.body.fechaNacimiento,
      genero: req.body.genero,
      ciudad: req.body.ciudad,
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Usuario actualizado exitosamente');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: usuarios[index]
    });
    
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE - Eliminar usuario
app.delete('/api/usuarios/:id', (req, res) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🗑️  DELETE /api/usuarios/' + req.params.id);
  
  const index = usuarios.findIndex(u => u._id === req.params.id);
  
  if (index === -1) {
    console.log('❌ Usuario no encontrado');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  const usuarioEliminado = usuarios.splice(index, 1)[0];
  
  console.log('✅ Usuario eliminado:', usuarioEliminado.nombres, usuarioEliminado.apellidos);
  console.log('📊 Total usuarios restantes:', usuarios.length);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  res.json({ mensaje: 'Usuario eliminado exitosamente' });
});

// ============================================
// RUTA RAÍZ - INFO DE LA API
// ============================================
app.get('/', (req, res) => {
  res.json({
    mensaje: '🎉 API del Formulario funcionando correctamente',
    version: '1.0.0',
    modo: 'Datos en memoria (sin MongoDB)',
    endpoints: {
      crear: 'POST /api/usuarios',
      listarTodos: 'GET /api/usuarios',
      obtenerUno: 'GET /api/usuarios/:id',
      actualizar: 'PUT /api/usuarios/:id',
      eliminar: 'DELETE /api/usuarios/:id'
    },
    estadisticas: {
      usuariosRegistrados: usuarios.length,
      ultimaOperacion: new Date().toISOString()
    }
  });
});

// ============================================
// MANEJO DE ERRORES 404
// ============================================
app.use((req, res) => {
  console.log('❌ Ruta no encontrada:', req.method, req.path);
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    ruta: req.path,
    metodo: req.method
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║                                            ║');
  console.log('║   🚀 SERVIDOR BACKEND INICIADO             ║');
  console.log('║                                            ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log('║                                            ║');
  console.log(`║   📍 URL: http://localhost:${PORT}           ║`);
  console.log('║   📝 Modo: Datos en memoria                ║');
  console.log('║   ✅ CORS habilitado                       ║');
  console.log('║   🔥 Hot reload activo (nodemon)           ║');
  console.log('║                                            ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log('║                                            ║');
  console.log('║   📋 Endpoints disponibles:                ║');
  console.log('║   GET    /api/usuarios                     ║');
  console.log('║   POST   /api/usuarios                     ║');
  console.log('║   GET    /api/usuarios/:id                 ║');
  console.log('║   PUT    /api/usuarios/:id                 ║');
  console.log('║   DELETE /api/usuarios/:id                 ║');
  console.log('║                                            ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('\n');
  console.log('💡 Tip: Abre http://localhost:5000 para ver info de la API\n');
});