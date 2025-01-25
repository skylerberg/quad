import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  base: '/tile-game/',
  plugins: [svelte({
    preprocess: true,
  })],
})
