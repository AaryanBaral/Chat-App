import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isNewGroup: false,
  isAddMember: false,
  isNotification: false,
  isFileMenu: false,
  isSearch: false,
  isDeleteMenu: false,
  isMobileMenuFriend: false,
  uploadingLoader: false,
  selectedDeletedChat: {
    chatId: "",
    groupChat: false,
  },
};
const authSlice = createSlice({
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
    setIsMobileMenuFriend: (state, action) => {
      state.isMobileMenuFriend = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setSelectedDeletedChat: (state, action) => {
      state.selectedDeletedChat = action.payload;
    },
  },
});
export default authSlice;

export const {
  setIsNewGroup,
  setIsAddMember,
  setIsNotification,
  setIsFileMenu,
  setIsSearch,
  setIsDeleteMenu,
  setIsMobileMenuFriend,
  setUploadingLoader,
  setSelectedDeletedChat,
} = authSlice.actions;
