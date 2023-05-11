import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
   //엔티티 어댑터를 생성하는 곳에서 정렬 비교 기능을 제공한다.
   //완료된 항목이 아래로가고 완료되지 않은 항목은 위로 올라오게 한다.
   sortComparer: (a, b) =>
      a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      getNotes: builder.query({
         query: () => "/notes",
         validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
         },
         keepUnusedDataFor: 5, //5s
         transformResponse: (responseData) => {
            const loadedNotes = responseData.map((user) => {
               user.id = user._id;
               return user;
            });
            return notesAdapter.setAll(initialState, loadedNotes);
         },
         providesTags: (result, error, arg) => {
            if (result?.ids) {
               return [
                  { type: "User", id: "LIST" },
                  ...result.ids.map((id) => ({ type: "User", id })),
               ];
            } else return [{ type: "User", id: "LIST" }];
         },
      }),
   }),
});

export const { useGetNotesQuery } = notesApiSlice;

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector
const selectNotesData = createSelector(
   selectNotesResult,
   (notesResult) => notesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
   selectAll: selectAllNotes,
   selectById: selectNoteById,
   selectIds: selectNoteIds,
   // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
   (state) => selectNotesData(state) ?? initialState
);
