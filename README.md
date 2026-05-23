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
git clone https://github.com/tu-usuario/flujo.git
cd flujo

# Instala dependencias
npm install

# Configura las variables de entorno
touch .env

# Agrega las siguientes variables:
# VITE_SUPABASE_URL=
# VITE_SUPABASE_ANON_KEY=

# Inicia el proyecto
npm run dev
