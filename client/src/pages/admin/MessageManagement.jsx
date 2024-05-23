import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Table from '../../components/shared/Table';
import { Avatar, Stack } from '@mui/material';
import { dashboardData } from '../../components/constants/SampleData';
import { transformImage } from '../../lib/features';
import moment from 'moment';
import { Box } from '@mui/system';
import { fileFormat } from '../../lib/features';
import RenderAttachment from '../../components/shared/RenderAttachment';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    headerClassName: 'table-header',
    width: 200,
  },
  {
    field: 'attachments',
    headerName: 'Attachments',
    headerClassName: 'table-header',
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;
      return attachments?.length > 0
        ? attachments.map((i, index) => {
            const url = i.url;
            const file = fileFormat(url);
            return (
              <Box key={index}>
                <a href={url} target="_blank" download style={{ color: 'black' }}>
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : 'No Attachments';
    },
  },
  {
    field: 'content',
    headerName: 'Content',
    headerClassName: 'table-header',
    width: 400,
  },
  {
    field: 'sender',
    headerName: 'Sent By',
    headerClassName: 'table-header',
    width: 200,
    renderCell: (params) => (
      <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
        <Avatar src={params.row.avatar} alt={params.row.avatar} />
        <span>{params.row.sender}</span>
      </Stack>
    ),
  },
  {
    field: 'chat',
    headerName: 'Chat',
    headerClassName: 'table-header',
    width: 220,
  },
  {
    field: 'groupChat',
    headerName: 'Group Chat',
    headerClassName: 'table-header',
    width: 100,
  },
  {
    field: 'createdAt',
    headerName: 'Time',
    headerClassName: 'table-header',
    width: 250,
  },
];

const MessageManagement = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      dashboardData.messages.map((i) => ({
        ...i,
        _id: i._id,
        sender: i.sender.name,
        avatar: transformImage(i.sender.avatar, 50),
        createdAt: moment(i.createdAt).format('DD/MM/YYYY'),
      }))
    );
  }, []);

  return (
    <AdminLayout>
      <Table heading={'All Messages'} columns={columns} rows={rows} rowHeight={200} />
    </AdminLayout>
  );
};

export default MessageManagement;
