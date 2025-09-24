// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Project root (where index.html is)
  build: {
    outDir: 'dist', // Output folder for builds
    rollupOptions: {
      input: {
        index: './index.html',
        login: './login.html',
        register: './register.html',
        profile: './profile.html',
        dashboard: './dashboard.html',
        shop: './shop.html',
        services: './services.html',
        contact: './contact.html'
        // Add more HTML files here if you have them (e.g., 'MultipleFiles/*.html')
      }
    }
  },
  server: {
    port: 5173, // Local dev port
    open: true // Auto-open browser on 'npm run dev'
  },
  base: './' // For relative paths in builds (good for Vercel)
});