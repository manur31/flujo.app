# Flujo

Flujo es una aplicación web enfocada en el control de ventas, gastos y cierres diarios de caja para pequeños negocios y emprendedores.

🚀 Objetivo

Simplificar la gestión financiera diaria mediante una plataforma intuitiva que permita registrar movimientos, visualizar reportes y mantener control del flujo de dinero en tiempo real.

🧩 Características principales

- Registro de ingresos y gastos diarios.
- Control de cierres de caja.
- Dashboard con visualización de datos y estadísticas.
- Generación automática de reportes en PDF.
- Sincronización de datos en tiempo real.
- Interfaz responsive optimizada para dispositivos móviles.

🛠️ Tecnologías utilizadas

Frontend: React.js, Tailwind CSS  
Backend & Database: Supabase  
Gráficas: Recharts  
Reportes PDF: jsPDF  
Despliegue: Vercel

📦 Instalación local

# Clona el repositorio
git clone https://github.com/manur31/flujo.app.git
cd flujo

# Instala dependencias
npm install

# Configura las variables de entorno
touch .env

# Agrega las siguientes variables:
VITE_SUPABASE_URL=https://fwdoirpqrjlcdtzgueza.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZG9pcnBxcmpsY2R0emd1ZXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI4NjMsImV4cCI6MjA3MzM3ODg2M30.UN_Cvr2DTWp4q9Rxc2bOzOl45ULWNhNEtId4cbtH98A

# Inicia el proyecto
npm run dev
