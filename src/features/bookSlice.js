import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBooks } from "./bookAPI";
import api from "../apiService";
import { toast } from "react-toastify";

const initialState = {
  books: [],
  bookDetails: null,
  readinglist: [],
  status: null,
};
export const fetchData = createAsyncThunk("book/fetchData", async (props) => {
  const res = await fetchBooks(props);
  return res.data;
});

export const getBookDetail = createAsyncThunk(
  "book/getBookDetail",
  async (bookId) => {
    const res = await api.get(`/books/${bookId}`);
    return res.data;
  }
);
export const addToReadingList = createAsyncThunk(
  "book/addToReadinglist",
  async (book) => {
    const res = await api.post(`/favorites`, book);
    return res.data;
  }
);

export const getReadingList = createAsyncThunk(
  "book/getBookFromList",
  async () => {
    const res = await api.get(`/favorites`);
    return res.data;
  }
);
export const removeBookFromList = createAsyncThunk(
  "book/removeBook",
  async (bookId) => {
    const res = await api.delete(`/favorites/${bookId}`);
    return res.data;
  }
);

export const bookSlice = createSlice({
  name: "book",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.books = action.payload;
        state.status = null;
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = "failed";
      });
    builder
      .addCase(getBookDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBookDetail.fulfilled, (state, action) => {
        state.status = null;
        state.bookDetails = action.payload;
      })
      .addCase(getBookDetail.rejected, (state) => {
        state.status = "failed";
      });
    builder
      .addCase(addToReadingList.pending, (state) => {})
      .addCase(addToReadingList.fulfilled, (state, action) => {
        console.log(action.payload);
        toast.success("The book has been added to the reading list!");
      })
      .addCase(addToReadingList.rejected, (state, action) => {
        toast.error(action.error.message);
      });
    builder
      .addCase(getReadingList.pending, (state) => {})
      .addCase(getReadingList.fulfilled, (state, action) => {
        state.readingList = action.payload;
      })
      .addCase(getReadingList.rejected, (state, action) => {
        toast.error(action.error.message);
      });
    builder
      .addCase(removeBookFromList.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeBookFromList.fulfilled, (state) => {
        state.status = null;
        toast.success("The book has been removed");
      })
      .addCase(removeBookFromList.rejected, (state) => {
        state.status = "Failed to remove book";
      });
  },
});

export default bookSlice.reducer;
