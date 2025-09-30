// src/services/api.js
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/usuarios'

export const obtenerUsuarios = async () => {
  try {
    console.log('🔍 GET:', API_URL)
    const response = await axios.get(API_URL)
    console.log('✅ Usuarios recibidos:', response.data.length)
    return response.data
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error.message)
    throw error
  }
}

export const obtenerUsuario = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error.message)
    throw error
  }
}

export const crearUsuario = async (usuario) => {
  try {
    console.log('📤 POST:', API_URL, usuario)
    const response = await axios.post(API_URL, usuario)
    console.log('✅ Usuario creado:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message)
    throw error
  }
}

export const actualizarUsuario = async (id, usuario) => {
  try {
    console.log('📤 PUT:', `${API_URL}/${id}`, usuario)
    const response = await axios.put(`${API_URL}/${id}`, usuario)
    console.log('✅ Usuario actualizado:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error.message)
    throw error
  }
}

export const eliminarUsuario = async (id) => {
  try {
    console.log('🗑️ DELETE:', `${API_URL}/${id}`)
    const response = await axios.delete(`${API_URL}/${id}`)
    console.log('✅ Usuario eliminado')
    return response.data
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error.message)
    throw error
  }
}