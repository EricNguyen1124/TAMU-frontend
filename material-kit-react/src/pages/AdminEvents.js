import React, { useEffect, useState } from "react";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import plusFill from "@iconify/icons-eva/plus-fill";
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";

import {
  MemberTableToolBar,
  MemberToolHeader,
  NewMemberModal,
  MembersUploadFile,
} from "../components/_dashboard/members";
import { AdminEventMoreDetails } from "src/components/_dashboard/events";
import { fDateTime } from "src/utils/formatTime.js";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "title", label: "Title", alignRight: false },
  { id: "company", label: "Company", alignRight: false },
  { id: "starttime", label: "Start time", alignRight: false },
  { id: "endtime", label: "End time", alignRight: false },
  { id: "count", label: "Count", alignRight: false },
  { id: "point", label: "Point", alignRight: false },
  { id: "checkincode", label: "Checkin-code", alignRight: false },
  { id: "event_type", label: "Event type", alignRight: false },
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
    return filter(array, (item) => {
      return (
        item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        item.company.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        item.event_type.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    });
  }
  return stabilizedThis.map((el) => el[0]);
}
// ------------------------------------------------------- //
export default function AdminEvents() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("title");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [members, setMembers] = useState([]);
  const [openNewMember, setOpenNewMemberModal] = useState(false);
  const [openUploadFile, setOpenUploadFile] = useState(false);
  // const { setLoading, displayErrMess } = useAuth();

  useEffect(async () => {
    // console.log("init members");
    // const members_ = await getAllMembers();
    const members_ = await getAllEvents();
    setMembers(members_.data);

    // console.log(members_);
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = members.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - members.length) : 0;

  const filterdMembers = applySortFilter(
    members,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filterdMembers.length === 0;

  return (
    <Page title="Member | MISSO">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Admin Event Board
          </Typography>
          <div>
            {/* <Button
              variant="contained"
              startIcon={<Icon icon={plusFill} />}
              onClick={() => setOpenNewMemberModal(true)}
            >
              New Member
            </Button> */}
            <Button
              variant="contained"
              // startIcon={<CloudUploadIcon />}
              style={{ marginLeft: "5px" }}
              // onClick={() => setOpenUploadFile(true)}
            >
              Total Events: {members.length}
            </Button>
            <CsvFileExport data={members} fileName="events" />
          </div>
        </Stack>

        <Card>
          <MemberTableToolBar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            text="Search by Title or Company"
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <MemberToolHeader
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={members.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filterdMembers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const isItemSelected = selected.indexOf(row.id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={row.id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, row.id)}
                            />
                          </TableCell>
                          <TableCell align="left" className={classes.cell}>
                            {row.title}
                          </TableCell>
                          <TableCell align="left" className={classes.cell}>
                            {row.company}
                          </TableCell>
                          <TableCell align="left" className={classes.cell}>
                            {fDateTime(row.datetime)}
                          </TableCell>
                          <TableCell align="left" className={classes.cell}>
                            {fDateTime(row.endtime)}
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color="success">
                              {row.count}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color="info">
                              {row.point}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color="warning">
                              {row.checkin_code}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color="info">
                              {row.event_type}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <AdminEventMoreDetails
                              chosenItem={row}
                              // setMembers={setMembers}
                              // members={members}
                              // update_all_members_func={getAllMembers}
                            />
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
            count={members.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <NewMemberModal
        open={openNewMember}
        setOpen={setOpenNewMemberModal}
        setMembers={setMembers}
      />
      <MembersUploadFile
        open={openUploadFile}
        setOpen={setOpenUploadFile}
        setMembers={setMembers}
      />
    </Page>
  );
}

import { makeStyles } from "@material-ui/styles";
import { getAllEvents } from "src/mysql_db_api/events";
import CsvFileExport from "src/components/CsvFileExport";

const useStyles = makeStyles({
  cell: {
    maxWidth: "25ch",
    overflow: "hidden",
  },
});
