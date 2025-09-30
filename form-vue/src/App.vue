<script setup>
import { ref, onMounted } from 'vue'
import ListaUsuarios from './components/userList.vue'
import FormUser from './components/formUser.vue'
import * as api from './servicies/api'

// Estados reactivos
const usuarios = ref([])
const usuarioEditar = ref(null)
const mensaje = ref({ tipo: '', texto: '' })

// Función para cargar usuarios
const cargarUsuarios = async () => {
  try {
    console.log(' Cargando usuarios...')
    const data = await api.obtenerUsuarios()
    usuarios.value = data
    console.log(' Usuarios cargados:', data.length)
  } catch (error) {
    console.error(' Error al cargar usuarios:', error)
    mostrarMensaje('error', 'Error al cargar usuarios')
  }
}

// Función para mostrar mensajes
const mostrarMensaje = (tipo, texto) => {
  mensaje.value = { tipo, texto }
  setTimeout(() => {
    mensaje.value = { tipo: '', texto: '' }
  }, 3000)
}

// Función para guardar (crear o actualizar)
const handleGuardar = async (formData) => {
  try {
    if (usuarioEditar.value) {
      await api.actualizarUsuario(usuarioEditar.value._id, formData)
      mostrarMensaje('success', 'Usuario actualizado exitosamente')
      usuarioEditar.value = null
    } else {
      await api.crearUsuario(formData)
      mostrarMensaje('success', 'Usuario creado exitosamente')
    }
    await cargarUsuarios()
  } catch (error) {
    console.error('Error al guardar:', error)
    const mensajeError = error.response?.data?.error || 'Error al guardar'
    mostrarMensaje('error', mensajeError)
  }
}

// Función para editar
const handleEditar = (usuario) => {
  usuarioEditar.value = usuario
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Función para eliminar
const handleEliminar = async (id) => {
  if (confirm('¿Está seguro de eliminar este usuario?')) {
    try {
      await api.eliminarUsuario(id)
      mostrarMensaje('success', 'Usuario eliminado exitosamente')
      await cargarUsuarios()
    } catch (error) {
      console.error('Error al eliminar:', error)
      mostrarMensaje('error', 'Error al eliminar usuario')
    }
  }
}

// Función para cancelar edición
const handleCancelar = () => {
  usuarioEditar.value = null
}

// Cargar usuarios al montar el componente
onMounted(() => {
  console.log('Componente montado')
  cargarUsuarios()
})
</script>

<template>
  <div id="app">
    <header>
      <h1>📝 Gestión de Usuarios</h1>
      <p>Sistema CRUD - Vue + Node.js</p>
    </header>

    <div v-if="mensaje.texto" :class="['mensaje', mensaje.tipo]">
      {{ mensaje.texto }}
    </div>

    <div class="container">
      <FormUser
        :usuario-editar="usuarioEditar"
        @guardar="handleGuardar"
        @cancelar="handleCancelar"
      />
      
      <ListaUsuarios
        :usuarios="usuarios"
        @editar="handleEditar"
        @eliminar="handleEliminar"
      />
    </div>
  </div>
</template>

<style>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
body{
  background-image: linear-gradient(to right, #cb75a6, #c184b8, #b692c5,
   #ad9fcd, #a8abd0, #a3b3d5, #a0bad8, #9fc1da, #93c8df, #87cfe1, #7dd6de, #7adcd6);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

@media (max-width: 968px) {
  .container {
    grid-template-columns: 1fr;
  }
}

.mensaje {
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mensaje.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.mensaje.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>