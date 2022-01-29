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
import Page from "src/components/Page";
import Label from "src/components/Label";
import Scrollbar from "src/components/Scrollbar";
import SearchNotFound from "src/components/SearchNotFound";
import {
  checkinEvent,
  deleteMemberFromEvent,
  getAllMembersToCheckin,
} from "src/mysql_db_api/events.js";

import {
  MemberMoreDetails,
  MemberTableToolBar,
  MemberToolHeader,
  // NewMemberModal,
  // MembersUploadFile,
} from "src/components/_dashboard/members";
import { fDateTime } from "src/utils/formatTime.js";
// import CsvFileExport from "src/components/CsvFileExport";
// ----------------------------------------------------------------------
import { getAllMembers } from "src/mysql_db_api/members";
import { useAuth } from "src/authentication/AuthContext";
const TABLE_HEAD = [
  { id: "first_name", label: "First", alignRight: false },
  { id: "last_name", label: "Last", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "psid", label: "Psid", alignRight: false },
  { id: "point", label: "Point", alignRight: false },
  { id: "updated_time", label: "Updated Time", alignRight: false },
  { id: "check-in", label: "Status", alignRight: false },
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
    return filter(array, (_user) => {
      return (
        _user.psid.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.first_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.last_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.psid.toLowerCase().indexOf(query.slice(3, 10)) !== -1
      );
    });
  }
  return stabilizedThis.map((el) => el[0]);
}
// ------------------------------------------------------- //
export default function Member({ event_id }) {
  
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("updated_time");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [members, setMembers] = useState([]);
  const [openNewMember, setOpenNewMemberModal] = useState(false);
  const [openUploadFile, setOpenUploadFile] = useState(false);
  // const { setLoading, displayErrMess } = useAuth();
  const { setLoading, displayErrMess } = useAuth();
  useEffect(async () => {
    // console.log("init members");
    try {
      setLoading(true);
      let members_ = await getAllMembersToCheckin(event_id);
      members_ = members_.data.map((member) => {
        if (member.event_id == null) {
          member.status = false;
        } else {
          member.status = true;
        }
        return member;
      });
      setMembers(members_);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = members.map((n) => n.psid);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, psid) => {
    const selectedIndex = selected.indexOf(psid);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, psid);
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

  const toggleStatus = async (event, member_id) => {
    console.log("viet");
    console.log(member_id);
    try {
      const members_ = members.map((member) => {
        let member_;
        if (member.psid === member_id) {
          member_ = { ...member, status: !member.status };
          console.log(member_);
        } else {
          member_ = member;
        }
        return member_;
      });
      setMembers(members_);
      let changed_member = members_.find((member) => member.psid === member_id);
      if (changed_member.status == true) {
        // add member to event attendance
        const res0 = await checkinEvent(event_id, member_id);
        console.log(res0);
        if (res0.data) {
          displayErrMess("Checkin Successfully!", "success");
        }
      } else {
        // remove member from event attendance
        const res1 = await deleteMemberFromEvent(event_id, member_id);
        console.log(res1);
        if (res1.data) {
          displayErrMess("Checkin Status Removed", "info");
        }
      }
    } catch (e) {
      console.log(e);
    }
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
    <>
      <Card>
        <MemberTableToolBar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          text="Search by Name or PSID"
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
                    const {
                      first_name,
                      last_name,
                      memberstatus,
                      email,
                      cougar_email,
                      point,
                      psid,
                      classification,
                      updated_time,
                      status,
                    } = row;
                    const isItemSelected = selected.indexOf(psid) !== -1;
                    return (
                      <TableRow
                        hover
                        key={psid}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          {/* <Checkbox
                            checked={isItemSelected}
                            onChange={(event) => handleClick(event, psid)}
                          /> */}
                        </TableCell>

                        <TableCell align="left" className={classes.cell}>
                          {first_name}
                        </TableCell>
                        <TableCell align="left" className={classes.cell}>
                          {last_name}
                        </TableCell>
                        <TableCell align="left" className={classes.cell}>
                          {email}
                        </TableCell>
                        <TableCell align="left" className={classes.cell}>
                          {psid}
                        </TableCell>
                        <TableCell align="left">
                          <Label variant="ghost" color="success">
                            {point}
                          </Label>
                        </TableCell>
                        {/* <TableCell align="left">{classification}</TableCell> */}
                        {/* <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={
                                (status === "banned" && "error") || "success"
                              }
                            >
                              {sentenceCase(memberstatus)}
                            </Label>
                          </TableCell> */}
                        <TableCell align="left">
                          {fDateTime(updated_time)}
                        </TableCell>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={status}
                            onChange={(event) => toggleStatus(event, psid)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {/* <MemberMoreDetails
                            // setChosenItem={setChosenItem}
                            chosenItem={row}
                            setMembers={setMembers}
                            members={members}
                            update_all_members_func={getAllMembers}
                          /> */}
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
    </>
  );
}

import { makeStyles } from "@material-ui/styles";
// import { exportDataCsv } from "src/utils/myutils";

const useStyles = makeStyles({
  cell: {
    maxWidth: "25ch",
    overflow: "hidden",
  },
});
