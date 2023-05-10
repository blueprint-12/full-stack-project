import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Welcome from "../src/features/auth/Welcome";
import DashLayout from "./components/DashLayout";
import Login from "./features/auth/Login";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";

function App() {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<Public />} />
            <Route path="login" element={<Login />} />
            {/* 퍼블릭 라우트 끝 */}

            <Route path="dash" element={<DashLayout />}>
               <Route index element={<Welcome />} />

               <Route path="notes">
                  <Route index element={<NotesList />}></Route>
               </Route>

               <Route path="users">
                  <Route index element={<UsersList />}></Route>
               </Route>
            </Route>
            {/* Dash 레이아웃 끝*/}
         </Route>
      </Routes>
   );
}

export default App;
