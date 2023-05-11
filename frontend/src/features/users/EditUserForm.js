import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
   // ! 2개의 뮤테이션을 사용하므로 한 API의 상태 변수명을 다르게 지정해야 한다.
   // TODO: 유저 업데이트 API 상태
   const [updateUser, { isLoading, isSuccess, isError, error }] =
      useUpdateUserMutation();
   // TODO: 유저 삭제 API 상태
   const [
      deleteUser,
      { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
   ] = useDeleteUserMutation();

   const navigate = useNavigate();

   const [username, setUsername] = useState(user.username);
   const [validUsername, setValidUsername] = useState(false);
   const [password, setPassword] = useState("");
   const [validPassword, setValidPassword] = useState(false);
   const [roles, setRoles] = useState(user.roles);
   // NewUserForm에서 추가된 state
   const [active, setActive] = useState(user.active);

   //NewUserForm과 동일한 내용
   useEffect(() => {
      setValidUsername(USER_REGEX.test(username));
   }, [username]);

   useEffect(() => {
      setValidPassword(PWD_REGEX.test(password));
   }, [password]);

   useEffect(() => {
      console.log(isSuccess);
      // TODO: 유저를 삭제 혹은 업데이트가 성공했을 시, 컴포넌트 state 초기화
      if (isSuccess || isDelSuccess) {
         setUsername("");
         setPassword("");
         setRoles([]);
         navigate("/dash/users");
      }
   }, [isSuccess, isDelSuccess, navigate]);

   const onUsernameChanged = (e) => setUsername(e.target.value);
   const onPasswordChanged = (e) => setPassword(e.target.value);

   const onRolesChanged = (e) => {
      const values = Array.from(
         e.target.selectedOptions,
         (option) => option.value
      );
      setRoles(values);
   };

   // TODO: active state는 이전 값에 의존하여 반대로 변경
   const onActiveChanged = () => setActive((prev) => !prev);

   // TODO: password가 있는 경우와 없는 경우를 나누어 유저 정보 update
   const onSaveUserClicked = async (e) => {
      if (password) {
         await updateUser({ id: user.id, username, password, roles, active });
      } else {
         await updateUser({ id: user.id, username, roles, active });
      }
   };

   // TODO: 유저를 삭제할 때에는 id만 넘겨준다.
   const onDeleteUserClicked = async () => {
      await deleteUser({ id: user.id });
   };

   const options = Object.values(ROLES).map((role) => {
      return (
         <option key={role} value={role}>
            {" "}
            {role}
         </option>
      );
   });

   let canSave;

   // TODO: 위의 유저 정보가 password가 있을 때 없을 때 (두가지 경우)를 고려하므로 cansave도 동일하게 처리
   if (password) {
      canSave =
         [roles.length, validUsername, validPassword].every(Boolean) &&
         !isLoading;
   } else {
      canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
   }

   // valid css class명
   const errClass = isError || isDelError ? "errmsg" : "offscreen";
   const validUserClass = !validUsername ? "form__input--incomplete" : "";
   // ? password && !validPassword : input값이 비었을 때에도 빨간 아웃라인을 피하기 위해 AND 연산자를 활용
   const validPwdClass =
      password && !validPassword ? "form__input--incomplete" : "";
   const validRolesClass = !Boolean(roles.length)
      ? "form__input--incomplete"
      : "";

   const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

   const content = (
      <>
         <p className={errClass}>{errContent}</p>

         <form className="form" onSubmit={(e) => e.preventDefault()}>
            <div className="form__title-row">
               <h2>Edit User</h2>
               <div className="form__action-buttons">
                  <button
                     className="icon-button"
                     title="Save"
                     onClick={onSaveUserClicked}
                     disabled={!canSave}>
                     <FontAwesomeIcon icon={faSave} />
                  </button>
                  <button
                     className="icon-button"
                     title="Delete"
                     onClick={onDeleteUserClicked}>
                     <FontAwesomeIcon icon={faTrashCan} />
                  </button>
               </div>
            </div>
            <label className="form__label" htmlFor="username">
               Username: <span className="nowrap">[3-20 letters]</span>
            </label>
            <input
               className={`form__input ${validUserClass}`}
               id="username"
               name="username"
               type="text"
               autoComplete="off"
               value={username}
               onChange={onUsernameChanged}
            />

            <label className="form__label" htmlFor="password">
               Password: <span className="nowrap">[empty = no change]</span>{" "}
               <span className="nowrap">[4-12 chars incl. !@#$%]</span>
            </label>
            <input
               className={`form__input ${validPwdClass}`}
               id="password"
               name="password"
               type="password"
               value={password}
               onChange={onPasswordChanged}
            />

            <label
               className="form__label form__checkbox-container"
               htmlFor="user-active">
               ACTIVE:
               <input
                  className="form__checkbox"
                  id="user-active"
                  name="user-active"
                  type="checkbox"
                  checked={active}
                  onChange={onActiveChanged}
               />
            </label>

            <label className="form__label" htmlFor="roles">
               ASSIGNED ROLES:
            </label>
            <select
               id="roles"
               name="roles"
               className={`form__select ${validRolesClass}`}
               multiple={true}
               size="3"
               value={roles}
               onChange={onRolesChanged}>
               {options}
            </select>
         </form>
      </>
   );

   return content;
};
export default EditUserForm;
