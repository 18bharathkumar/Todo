import Navbar from "./components/navbar"
import { BrowserRouter,Routes,Route } from "react-router-dom"
import SignIn from "./components/signin"
import SignUp from "./components/signup"
import Todo from "./components/todos"
import CreateTodo from "./components/createtodo"
function App() {
 

  return (
    <>
    
    <BrowserRouter>
    <Navbar/>
   
    <Routes>
      <Route path="/about" element={<h1>About</h1>} />
      <Route path="/features" element={<h1>Features</h1>} />
      <Route path="/login" element={<SignIn/>} />
      <Route path="/register" element={<SignUp/>} />
      <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      <Route path="/" element={<Todo/>}/>
      <Route path="create-todo" element={<CreateTodo/>}/>

    </Routes>
    
    </BrowserRouter>
      
    </>
  )
}



export default App
