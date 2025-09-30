import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


const usuarios = [
  { id: 1, nombre: 'Juan' },
  { id: 2, nombre: 'María' },
]

createApp(App).mount('#app')
