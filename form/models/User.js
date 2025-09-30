const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  dni: {
    type: String,
    required: [true, 'El DNI es obligatorio'],
    unique: true,
    minlength: [10, 'El DNI debe tener 10 caracteres'],
    maxlength: [10, 'El DNI debe tener 10 caracteres']
  },
  nombres: {
    type: String,
    required: [true, 'Los nombres son obligatorios'],
    trim: true
  },
  apellidos: {
    type: String,
    required: [true, 'Los apellidos son obligatorios'],
    trim: true
  },
  fechaNacimiento: {
    type: Date,
    required: [true, 'La fecha de nacimiento es obligatoria']
  },
  genero: {
    type: String,
    required: [true, 'El género es obligatorio'],
    enum: ['masculino', 'femenino', 'otro']
  },
  ciudad: {
    type: String,
    required: [true, 'La ciudad es obligatoria']
  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model('User', usuarioSchema);