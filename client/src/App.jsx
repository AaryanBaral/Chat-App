import {lazy, Suspense, useEffect} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import {LayoutLoader} from "./components/layout/Loader"
import { server } from '../../server/constants/configure'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from './redux/reducers/auth'
import {Toaster} from "react-hot-toast"

const Home = lazy(()=> import("./pages/Home") )
const Group = lazy(()=> import("./pages/Group") )
const Login = lazy(()=> import("./pages/Login") )
const Chat = lazy(()=> import("./pages/Chat") )
const NotFound = lazy(()=> import("./pages/NotFound") )
const AdminLogin = lazy(()=> import("./pages/admin/AdminLogin") ) 
const DashBoard = lazy(()=> import("./pages/admin/DashBoard") ) 
const UserManagement = lazy(()=> import("./pages/admin/UserManagement") ) 
const MessageManagement = lazy(()=> import("./pages/admin/MessageManagement") ) 
const ChatManagement = lazy(()=> import("./pages/admin/ChatManagement") ) 


const App = () => {
  const {user,loader} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  useEffect(()=>{
      axios.get(`${server}/api/v1/user/me`)
      .then((res)=>console.log(res))
      .catch(()=>dispatch(userNotExists()))

  },[dispatch])
  return loader?<LayoutLoader />: (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader/>}>
      <Routes>
      <Route element={<ProtectedRoute user={user}/>}>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/chat/:chatId' element={<Chat/>}/>
        <Route exact path='/groups' element={<Group/>}/>
      </Route>
      <Route exact path='/login' element={
        <ProtectedRoute user={!user} redirect='/'>
          <Login/>
        </ProtectedRoute>
      }/>
      <Route path='/admin' element={<AdminLogin/>} />
      <Route path='/admin/dashboard' element={<DashBoard/>} />
      <Route path='/admin/user' element={<UserManagement/>} />
      <Route path='/admin/message' element={<MessageManagement/>} />
      <Route path='/admin/chat' element={<ChatManagement/>} />
      <Route path='*' element={<NotFound/>} />
    </Routes>
      </Suspense>
      <Toaster position='bottom-center'/>
    </BrowserRouter>
  )
}

export default App;



