import { Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu } from '../../redux/reducers/misc';
import { Image as ImageIcon } from '@mui/icons-material';

const FileMenu = ({anchorE1}) => {
  const {isFileMenu} = useSelector(state=>state.misc);
  const dispatch = useDispatch()
  const closeFileMenu = ()=>{
    dispatch(setIsFileMenu(false))
  }
  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu}>
      <div style={{
        width:"10rem"
      }}>
      <MenuList>
          <MenuItem>
          <Tooltip title="Image">
            <ImageIcon />
          </Tooltip>
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  )
}

export default FileMenu
