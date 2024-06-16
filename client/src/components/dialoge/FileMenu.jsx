import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import {
  AudioFile as AudioFileIcon, 
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import { useRef } from "react";
import { toast} from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const FileMenu = ({ anchorE1, chatId }) => {
  const imageRef = useRef();
  const audioRef = useRef();
  const videoRef = useRef();
  const fileRef = useRef();
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [sendAttachments] = useSendAttachmentsMutation()
  const selectImage = ()=> imageRef.current?.click()
  const selectAudio = ()=> audioRef.current?.click()
  const selectVideo = ()=> videoRef.current?.click()
  const selectFile = ()=> fileRef.current?.click()
  const closeFileMenu = () => {
    dispatch(setIsFileMenu(false));
  };
  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <=0) return ;
    if(files.length > 10) return toast.error(`You can only send 10 ${key} at a time`);
    dispatch(setUploadingLoader(true))
    const toastId = toast.loading(`Sending ${key} .....`);
    closeFileMenu();

     try {
      const form = new FormData();
      form.append("chatId",chatId)
      files.forEach((file)=> form.append("files",file)) 
      const res = await sendAttachments(form);
      if(res.data) toast.success(`${key} sent successfully`,{id:toastId})
      else toast.rttot(`failed to send ${key}`,{id:toastId})
     } catch (error) {
      toast.error(error,{id:toastId})
     }finally{
      distapch(setUploadingLoader(false))
     }
  };
  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu}>
      <div
        style={{
          width: "10rem",
        }}
      >
        <MenuList>
          <MenuItem onClick={selectImage}>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem " }}>Image</ListItemText>
            <input
              type="file"
              name=""
              multiple
              accept="image/png, image/jpg, image/jpeg, image/webp, image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Images")}
              ref={imageRef}
            />
          </MenuItem>
          <MenuItem onClick={selectAudio}>
            <Tooltip title="Audio">
              <AudioFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem " }}>Audio</ListItemText>
            <input
              type="file"
              name=""
              multiple
              accept="audio/mpeg, audio/mp3, audio/wav"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
              ref={audioRef}
            />
          </MenuItem>
          <MenuItem onClick={selectVideo}>
            <Tooltip title="Video">
              <VideoFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem " }}>Video</ListItemText>
            <input
              type="file"
              name=""
              multiple
              accept="video/mp4, video/ogg, video/webm, video/avi"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
              ref={videoRef}
            />
          </MenuItem>
          <MenuItem onClick={selectFile}>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem " }}>File</ListItemText>
            <input
              type="file"
              name=""
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Files")}
              ref={fileRef}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
