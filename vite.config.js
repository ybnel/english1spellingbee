import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        form: 'form.html',
        payment: 'payment.html'
      }
    }
  }
});
