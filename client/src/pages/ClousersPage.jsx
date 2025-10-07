import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Link } from 'react-router'
import { useClousing } from '../context/ClousingContext'
import { useEffect, useState } from 'react'
import Header from "../components/Header";

function ClousersPage() {
  const { getClousings, clousings } = useClousing()
  const [view, setView] = useState("all");
  const [range, setRange] = useState("daily");

  useEffect(() => {
    getClousings()
  },[])

  useEffect(() => {
    console.log(clousings)
  },[clousings])

  function groupData(data, range = "daily") {
    const grouped = {};

    data.forEach(item => {
      let key;

      if (range === "daily") {
        // Día exacto
        key = item.date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
      } 
      else if (range === "weekly") {
        // Año + Semana
        const firstDay = new Date(item.date);
        const weekNumber = Math.ceil(
          ((firstDay - new Date(firstDay.getFullYear(), 0, 1)) / 86400000 + firstDay.getDay() + 1) / 7
        );
        key = `Semana ${weekNumber} - ${firstDay.getFullYear()}`;
      } 
      else if (range === "monthly") {
        // Mes y año
        key = item.date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
      }

      if (!grouped[key]) {
        grouped[key] = { ingresos: 0, gastos: 0, total: 0 };
      }

      grouped[key].ingresos += item.ingresos;
      grouped[key].gastos += item.gastos;
      grouped[key].total += item.total;
    });

    // Convertir el objeto a array para Recharts
    return Object.entries(grouped).map(([key, value]) => ({
      label: key,
      ...value
    }));
  }


  const parsedData = clousings.map(dayData => {
    const ingresos = dayData.transations
      .filter(t => t.type === "sale")
      .reduce((acc, t) => acc + t.amount * t.unit_price, 0);

    const gastos = dayData.transations
      .filter(t => t.type === "expense")
      .reduce((acc, t) => acc + t.amount * t.unit_price, 0);

    return {
      date: new Date(dayData.created_at),
      day: dayData.day,
      ingresos,
      gastos,
      total: ingresos - gastos
    };
  });


  const chartData = groupData(parsedData, range);

  return (
    <main className='w-full h-dvh m-auto bg-white dark:bg-[#1E293B]'>
      <Header/>
      <div className="w-full flex flex-col items-center mt-10 px-4">
      {/* Filtros de tiempo */}
      <div className="flex gap-4 mb-10">
        {["daily", "weekly", "monthly"].map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-lg ${
              range === r ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {r === "daily" ? "Diario" : r === "weekly" ? "Semanal" : "Mensual"}
          </button>
        ))}
      </div>
      <article className="w-full">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" fill="white"/>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend/>
              {(view === "all" || view === "ingresos") && (
                <Area type="monotone" dataKey="ingresos" stroke="#16a34a" fill="#16a34a50" name="Ingresos" />
              )}
              {(view === "all" || view === "gastos") && (
                <Area type="monotone" dataKey="gastos" stroke="#dc2626" fill="#dc262650" name="Gastos" />
              )}
              {view === "all" && (
                <Area type="monotone" dataKey="total" stroke="#2563eb" fill="#2563eb40" name="Total" />
              )}
          </AreaChart>
        </ResponsiveContainer>
      </article>

      <div className="flex justify-center gap-4 w-full mt-8">
        <button onClick={() => setView("all")} className={`px-4 py-2 rounded-lg ${view === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          Todo
        </button>
        <button onClick={() => setView("ingresos")} className={`px-4 py-2 rounded-lg ${view === "ingresos" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
          Solo Ingresos
        </button>
        <button onClick={() => setView("gastos")} className={`px-4 py-2 rounded-lg ${view === "gastos" ? "bg-red-600 text-white" : "bg-gray-200"}`}>
          Solo Gastos
        </button>
      </div>
    </div>
    </main>
  )
}

export default ClousersPage