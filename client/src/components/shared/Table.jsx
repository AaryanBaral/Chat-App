import { Container } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Typography } from "@mui/material";
import { matBlack } from "../../constants/color";

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <Container
      sx={{
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: "1rem",
          width: "100%",
          overflow: "hidden",
          padding: "2rem",
          margin: "auto",
          height: "100%",
          boxShadow: "none",
        }}
      >
        <Typography
          textAlign={"center"}
          variant="h4"
          sx={{
            margin: "2rem",
            textTransform: "uppercase",
          }}
        >
          {" "}
          {heading}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowHeight={rowHeight}
          style={{ height: "80%" }}
          sx={{
            border: "none",
            ".table-header": {
              bgcolor: matBlack,
              color: "white",
            },
          }}
        ></DataGrid>
      </Paper>
    </Container>
  );
};

export default Table;
