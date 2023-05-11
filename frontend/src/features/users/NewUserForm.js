import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
   const [addNewUser, { isLoading, isSuccess, isError, error }] =
      useAddNewUserMutation();

   const navigate = useNavigate();

   const [username, setUsername] = useState("");
   const [validUsername, setValidUsername] = useState(false);
   const [password, setPassword] = useState("");
   const [validPassword, setValidPassword] = useState(false);
   const [roles, setRoles] = useState(["Employee"]);

   //TODO: 정규식 테스트
   useEffect(() => {
      setValidUsername(USER_REGEX.test(username));
   }, [username]);
   useEffect(() => {
      setValidPassword(PWD_REGEX.test(password));
   }, [password]);

   //TODO: isSuccess라면 기존 state값 초기화 후, /dash/users로 라우팅

   useEffect(() => {
      if (isSuccess) {
         setUsername("");
         setPassword("");
         setRoles([]);
         navigate("/dash/users");
      }
   }, [isSuccess, navigate]);

   const onUsernameChanged = (e) => setUsername(e.target.value);
   const onPasswordChanged = (e) => setPassword(e.target.value);

   const onRolesChanged = (e) => {
      //1개 이상의 옵션이 선택될 때를 허용하기 위함
      const values = Array.from(
         e.target.selectedOptions, // HTMLCollection 객체라서 배열로 변환해줘야 함
         (option) => option.value
      );
      setRoles(values);
   };

   // TODO: valid한 상황이 아니라면 submit button 비활성화 용도
   const canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

   // TODO: 새로운 유저 데이터가 form에서 summit 됐을 때 API콜
   const onSaveUserClicked = async (e) => {
      e.preventDefault();
      if (canSave) {
         await addNewUser({ username, password, roles });
      }
   };

   // Object.values(): 전달된 파라미터 객체가 가지는 (열거 가능한) 속성의 값들로 이루어진 배열을 리턴한다. for...in 구문과 동일한 순서를 가진다.
   const options = Object.values(ROLES).map((role) => {
      return (
         <option key={role} value={role}>
            {role}
         </option>
      );
   });

   // valid판별 css 클래스명
   const errClass = isError ? "errmsg" : "offscreen";
   const validUserClass = !validUsername ? "form__input--incomplete" : "";
   const validPwdClass = !validPassword ? "form__input--incomplete" : "";
   const validRolesClass = !Boolean(roles.length)
      ? "form__input--incomplete"
      : "";
   const content = (
      <>
         <p className={errClass}>{error?.data?.message}</p>

         <form className="form" onSubmit={onSaveUserClicked}>
            <div className="form__title-row">
               <h2>New User</h2>
               <div className="form__action-buttons">
                  <button
                     className="icon-button"
                     title="Save"
                     disabled={!canSave}>
                     <FontAwesomeIcon icon={faSave} />
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
               Password:{" "}
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

export default NewUserForm;
