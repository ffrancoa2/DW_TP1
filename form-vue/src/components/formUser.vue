<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  usuarioEditar: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['guardar', 'cancelar'])

// Estado del formulario
const formData = ref({
  dni: '',
  nombres: '',
  apellidos: '',
  fechaNacimiento: '',
  genero: 'masculino',
  ciudad: ''
})

const errores = ref({})

const ciudades = ['Milagro','Guayaquil', 'Quito', 'Cuenca', 'Ambato', 'Machala', 'Manta']


// IMPORTANTE: Definir la función ANTES de usarla en watch
const limpiarFormulario = () => {
  formData.value = {
    dni: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: 'masculino',
    ciudad: ''
  }
}

// Watch para cargar datos al editar
watch(() => props.usuarioEditar, (nuevoUsuario) => {
  if (nuevoUsuario) {
    formData.value = {
      ...nuevoUsuario,
      fechaNacimiento: nuevoUsuario.fechaNacimiento?.split('T')[0] || ''
    }
  } else {
    limpiarFormulario()
  }
}, { immediate: true })

// Validar formulario
const validarFormulario = () => {
  const nuevosErrores = {}

  if (!formData.value.dni || formData.value.dni.length !== 10) {
    nuevosErrores.dni = 'El DNI debe tener exactamente 10 caracteres'
  }

  if (!formData.value.nombres.trim()) {
    nuevosErrores.nombres = 'Los nombres son obligatorios'
  }

  if (!formData.value.apellidos.trim()) {
    nuevosErrores.apellidos = 'Los apellidos son obligatorios'
  }

  if (!formData.value.fechaNacimiento) {
    nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es obligatoria'
  }

  if (!formData.value.ciudad) {
    nuevosErrores.ciudad = 'Debe seleccionar una ciudad'
  }

  errores.value = nuevosErrores
  return Object.keys(nuevosErrores).length === 0
}

// Submit del formulario
const handleSubmit = () => {
  if (validarFormulario()) {
    emit('guardar', { ...formData.value })
    if (!props.usuarioEditar) {
      limpiarFormulario()
    }
    errores.value = {}
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="formulario">
    <h2>{{ usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>

    <div class="form-group">
      <label>DNI *</label>
      <input
        v-model="formData.dni"
        type="text"
        maxlength="10"
        placeholder="0123456789"
      />
      <span v-if="errores.dni" class="error">{{ errores.dni }}</span>
    </div>

    <div class="form-group">
      <label>Nombres *</label>
      <input
        v-model="formData.nombres"
        type="text"
        placeholder="nombres"
      />
      <span v-if="errores.nombres" class="error">{{ errores.nombres }}</span>
    </div>

    <div class="form-group">
      <label>Apellidos *</label>
      <input
        v-model="formData.apellidos"
        type="text"
        placeholder="apellidos"
      />
      <span v-if="errores.apellidos" class="error">{{ errores.apellidos }}</span>
    </div>

    <div class="form-group">
      <label>Fecha de Nacimiento *</label>
      <input
        v-model="formData.fechaNacimiento"
        type="date"
      />
      <span v-if="errores.fechaNacimiento" class="error">{{ errores.fechaNacimiento }}</span>
    </div>

    <div class="form-group">
      <label>Género *</label>
      <div class="radio-group">
        <label>
          <input
            v-model="formData.genero"
            type="radio"
            value="masculino"
          />
          Masculino
        </label>
        <label>
          <input
            v-model="formData.genero"
            type="radio"
            value="femenino"
          />
          Femenino
        </label>
        <label>
          <input
            v-model="formData.genero"
            type="radio"
            value="otro"
          />
          Otro
        </label>
      </div>
    </div>

    <div class="form-group">
      <label>Ciudad *</label>
      <select v-model="formData.ciudad">
        <option value="">Seleccione una ciudad</option>
        <option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">
          {{ ciudad }}
        </option>
      </select>
      <span v-if="errores.ciudad" class="error">{{ errores.ciudad }}</span>
    </div>

  
    <div class="form-actions">
      <button type="submit" class="btn-primary">
        {{ usuarioEditar ? 'Actualizar' : 'Guardar' }}
      </button>
      <button
        v-if="usuarioEditar"
        type="button"
        @click="emit('cancelar')"
        class="btn-secondary"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<style scoped>
.formulario {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.formulario h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.radio-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
}

.error {
  color: #e74c3c;
  font-size: 12px;
  display: block;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #667eea;
  color: white;
  flex: 1;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
  flex: 1;
}

.btn-secondary:hover {
  background: #7f8c8d;
}
</style>