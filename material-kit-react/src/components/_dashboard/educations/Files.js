import { filter, identity } from "lodash";
import { useState } from "react";
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { fDateTime } from "src/utils/formatTime.js";

// components
import Page from "src/components/Page";
// import Label from "../../../../components/Label";
import Scrollbar from "src/components/Scrollbar";
import SearchNotFound from "src/components/SearchNotFound";
import { getMimeType, getIcon } from "src/utils/myutils";
import TableHeaderFile from "./TableHeaderFile";
// ----------------------------------------------------------------------
// utils

import { seeFile } from "src/google-drive-api/database";
import { useAuth } from "src/authentication/AuthContext.js";
import { formatNumber } from "src/utils/myutils.js";
import FileTableTool from "./FileTableToolBar";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "mimeType", label: "Type", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "createdtime", label: "Created Time", alignRight: false },
  { id: "modifiedTime", label: "Mofified Time", alignRight: false },
  { id: "size", label: "Size", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function Files({ files }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = files.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - files.length) : 0;

  const filteredUsers = applySortFilter(
    files,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;
  const { setLoading } = useAuth();

  const viewFile = async (fileId, mimeType, name) => {
    setLoading(true);
    const res = await seeFile(fileId, getMimeType(mimeType));
    setTimeout(() => {
      window.open(`${res.data}`, "_blank");
      setLoading(false);
    }, 1000);
  };
  return (
    <Page title="User | Minimal-UI">
      <Card style={{ borderRadius: 3 }}>
        <FileTableTool
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableHeaderFile
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={filteredUsers.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const {
                      id,
                      name,
                      mimeType,
                      createdTime,
                      modifiedTime,
                      size,
                    } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell align="left" style={{ padding: "0px 16px" }}>
                          {getIcon(mimeType)}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          padding="0px 16px"
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left" style={{ padding: "0px 16px" }}>
                          {fDateTime(createdTime)}
                        </TableCell>
                        <TableCell align="left" style={{ padding: "0px 16px" }}>
                          {fDateTime(modifiedTime)}
                        </TableCell>
                        <TableCell align="left" style={{ padding: "0px 16px" }}>
                          {formatNumber(size)} kb
                        </TableCell>
                        <TableCell align="left" style={{ padding: 7 }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => viewFile(id, mimeType, name)}
                            style={{ padding: 0 }}
                          >
                            view
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={files.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Page>
  );
}
