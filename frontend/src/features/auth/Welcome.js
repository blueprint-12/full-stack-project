import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const content = (
    <section className="welcome">
      <p>{today}</p>

      <h1>Welcome!</h1>

      <p>
        <Link to="/dash/notes">테크 노트보기</Link>
      </p>
      <p>
        <Link to="/dash/notes/new">새로운 노트 작성하기</Link>
      </p>

      <p>
        <Link to="/dash/users">유저 세팅 보기</Link>
      </p>
      <p>
        <Link to="/dash/users/new">새로운 유저 추가하기</Link>
      </p>
    </section>
  );

  return content;
};

export default Welcome;
