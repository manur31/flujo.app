import { BrowserRouter, Routes, Route } from "react-router"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import FlujoVenta from "./pages/FlujoVenta"
import FlujoGasto from './pages/FlujoGasto'
import Register from "./pages/Register"
import { AuthProvider } from "./context/AuthContext"
import Profile from "./pages/Profile"
import { ProductProvider } from "./context/ProductContext"
import { ExpenseProvider } from "./context/ExpensesContext"
import { SaleProvider } from "./context/SalesContext"
import ProtectedRoute from "./ProtectedRoute"
import HomePage from "./pages/HomePage"

function App() {

  return (
    <>
    <AuthProvider>
      <ProductProvider>
        <ExpenseProvider>
          <SaleProvider>
            <BrowserRouter>
              <Routes>
                <Route path={'/'} element={<HomePage/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/register'} element={<Register/>}/>
                <Route element={<ProtectedRoute/>}>
                  <Route path={'/dashboard'} element={<Dashboard/>}/>
                  <Route path={'/venta'} element={<FlujoVenta/>}/>
                  <Route path={'/gasto'} element={<FlujoGasto/>}/>
                  <Route path={'/profile'} element={<Profile/>}/>
                </Route>
              </Routes>
            </BrowserRouter>
          </SaleProvider>
        </ExpenseProvider>
      </ProductProvider>
    </AuthProvider>
    </>
  )
}

export default App
