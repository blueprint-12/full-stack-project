import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";

const NotesList = () => {
  const {
    data: notes,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetNotesQuery(undefined, {
    pollingInterval: 15000, //15s
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  }); // 기본 쿼리 첫번째 인자 undefined, 두번째 인자 쿼리 설정을 변경하는 객체

  let content;

  if (isLoading) content = <p> Loading contents ... </p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (isSuccess) {
    // 서버에서 받아온 응답값(data)의 ids 구조분해로 가져옴
    const { ids } = notes;

    const tableContent = ids?.length
      ? ids.map((noteId) => <Note key={noteId} noteId={noteId} />)
      : null;

    content = (
      // 미디어 쿼리 적용됨
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Username
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }
  return content;
};

export default NotesList;
