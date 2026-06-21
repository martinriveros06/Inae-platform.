import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Se actualiza sola cuando subes cambios
      manifest: {
        name: 'INAE - Bienestar Estudiantil',
        short_name: 'INAE',
        description: 'Plataforma de Bienestar Estudiantil INACAP',
        theme_color: '#cc0000', // El rojo de INACAP para la barra de estado
        background_color: '#FDFBF7',
        display: 'standalone', // Esto oculta el navegador y la hace ver como app nativa
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
