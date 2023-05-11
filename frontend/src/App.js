import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Welcome from "../src/features/auth/Welcome";
import DashLayout from "./components/DashLayout";
import Login from "./features/auth/Login";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch";

function App() {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<Public />} />
            <Route path="login" element={<Login />} />
            {/* 퍼블릭 라우트 끝 */}

            <Route element={<Prefetch />}>
               <Route path="dash" element={<DashLayout />}>
                  <Route index element={<Welcome />} />
                  {/* dash/users/ */}
                  <Route path="users">
                     <Route index element={<UsersList />} />
                     <Route path=":id" element={<EditUser />} />
                     <Route path="new" element={<NewUserForm />} />
                  </Route>
                  {/* dash/notes/ */}
                  <Route path="notes">
                     <Route index element={<NotesList />} />
                     <Route path=":id" element={<EditNote />} />
                     <Route path="new" element={<NewNote />} />
                  </Route>
               </Route>
            </Route>
            {/* Dash 레이아웃 끝*/}
         </Route>
      </Routes>
   );
}

export default App;
