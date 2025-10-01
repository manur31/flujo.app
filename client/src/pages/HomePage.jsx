import React from "react";
import Button from "../components/Button";

const benefits = [
  {
    icon: "✅",
    title: "Control diario",
    description: "Registro sencillo de ingresos y gastos.",
  },
  {
    icon: "📈",
    title: "Reportes profesionales",
    description: "Descarga tus datos en PDF para compartir o imprimir.",
  },
  {
    icon: "📊",
    title: "Compatible con Excel",
    description: "Exporta tus registros para analizarlos o llevar un historial completo.",
  },
  {
    icon: "🔎",
    title: "Visualiza tu progreso",
    description: "Consulta gráficos claros y entiende cómo crece tu negocio.",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#1E293B] text-white flex flex-col items-center justify-center py-10 px-4 text-center">
        <h1 className="font-bold text-5xl pb-10">FLUJO</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Tu negocio, bajo control cada día
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          Registra tus ventas y gastos en segundos, descarga tus reportes en PDF
          y mantén un control profesional desde tu celular.
        </p>
        <div className="flex flex-col sm:flex-row sm:mt-4 px-10 justify-center items-center gap-6 w-full">
          <Button action={true} page={'/login'}>Ingresar a mi cuenta</Button>
            <Button page={'/register'}>Crear cuenta gratis</Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-12">Beneficios de usar Flujo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {benefits.map((b, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{b.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{b.title}</h3>
              <p className="text-gray-600">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E293B] text-white py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Empieza hoy mismo a organizar tu negocio
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Toma decisiones con información real y lleva tu negocio al siguiente nivel.
        </p>
        <div className="flex flex-col sm:flex-row sm:mt-4 px-10 justify-center items-center gap-6 w-full">
          <Button action={true} page={'/login'}>Ingresar a mi cuenta</Button>
            <Button page={'/register'}>Crear cuenta gratis</Button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6 px-6 text-center">
        <p>
          Flujo está diseñado para dueños de negocios como tú: herramientas
          simples, resultados grandes.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
