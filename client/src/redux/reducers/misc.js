import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isNewGroup: false,
  isAddMember: false,
  isNotification: false,
  isFileMenu: false,
  isSearch: false,
  isDeleteMenu: false,
  isMobile: false,
  uploadingLoader: false,
  selectedDeletedChat: {
    chatId: "",
    groupChat: false,
  },
};
const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setIsAddMember: (state, action) => {
      state.isAddMember = action.payload;
    },
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setSelectedDeletedChat: (state, action) => {
      state.selectedDeletedChat = action.payload;
    },
  },
});
export default miscSlice;

export const {
  setIsNewGroup,
  setIsAddMember,
  setIsNotification,
  setIsFileMenu,
  setIsSearch,
  setIsDeleteMenu,
  setIsMobile,
  setUploadingLoader,
  setSelectedDeletedChat,
} = miscSlice.actions;
