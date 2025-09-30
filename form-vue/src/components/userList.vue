<script setup>
// Props
const props = defineProps({
  usuarios: {
    type: Array,
    required: true
  }
})

// Emits
const emit = defineEmits(['editar', 'eliminar'])

// Formatear fecha
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-EC')
}
</script>

<template>
  <div class="lista-usuarios">
    <h2>Lista de Usuarios ({{ usuarios.length }})</h2>
    
    <p v-if="usuarios.length === 0" class="mensaje-vacio">
      No hay usuarios registrados
    </p>
    
    <div v-else class="tabla-container">
      <table>
        <thead>
          <tr>
            <th>DNI</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Fecha Nac.</th>
            <th>Género</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario._id">
            <td>{{ usuario.dni }}</td>
            <td>{{ usuario.nombres }}</td>
            <td>{{ usuario.apellidos }}</td>
            <td>{{ formatearFecha(usuario.fechaNacimiento) }}</td>
            <td>{{ usuario.genero }}</td>
            <td>{{ usuario.ciudad }}</td>
            
            <td>
              <button @click="emit('editar', usuario)" class="btn-editar">
                Editar
              </button>
              <button @click="emit('eliminar', usuario._id)" class="btn-eliminar">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.lista-usuarios {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.lista-usuarios h2 {
  margin-bottom: 20px;
  color: #333;
}

.mensaje-vacio {
  text-align: center;
  color: #999;
  padding: 40px;
  font-size: 1.1rem;
}

.tabla-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  color: black;
}

th {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

td {
  font-size: 0.95rem;
}

button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  margin-right: 5px;
}

.btn-editar {
  background: #3498db;
  color: white;
}

.btn-editar:hover {
  background: #2980b9;
}

.btn-eliminar {
  background: #e74c3c;
  color: white;
}

.btn-eliminar:hover {
  background: #c0392b;
}

@media (max-width: 768px) {
  .tabla-container {
    overflow-x: scroll;
  }
  
  table {
    font-size: 0.85rem;
  }
  
  button {
    padding: 6px 10px;
    font-size: 11px;
  }
}
</style>