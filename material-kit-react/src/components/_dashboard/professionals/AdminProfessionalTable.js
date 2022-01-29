import React, { useState } from "react";
import { filter } from "lodash";
// import { Icon } from "@iconify/react";
// import { sentenceCase } from "change-case";
// import plusFill from "@iconify/icons-eva/plus-fill";
// material
import {
  Card,
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
// components
import Page from "../../../components/Page";
import Label from "../../../components/Label";
import Scrollbar from "../../../components/Scrollbar";
import SearchNotFound from "../../../components/SearchNotFound";

import {
  MemberMoreDetails,
  MemberToolHeader,
  NewMemberModal,
  MembersUploadFile,
  AdminMemberTableToolBar,
} from "src/components/_dashboard/members";
import { fDateTime } from "src/utils/formatTime.js";
// ----------------------------------------------------------------------
import { toggle_is_check } from "src/mysql_db_api/members";
import { makeStyles } from "@material-ui/styles";
import { useAuth } from "src/authentication/AuthContext";

const TABLE_HEAD = [
  { id: "first_name", label: "First", alignRight: false },
  { id: "last_name", label: "Last", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "psid", label: "Psid", alignRight: false },
  { id: "point", label: "Point", alignRight: false },
  { id: "register_time", label: "Register time", alignRight: false },
  { id: "is_check", label: "Status", alignRight: false },
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
      (_user) =>
        _user.pro_id.toString().toLowerCase().indexOf(query.toLowerCase()) !==
          -1 ||
        _user.psid.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.first_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.last_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
// ------------------------------------------------------- //
export default function Member({
  members,
  setMembers,
  update_all_members_func,
  tbl_name,
}) {
  const { displayErrMess, setLoading, isSuperAdmin, isPD } = useAuth();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("register_time");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openNewMember, setOpenNewMemberModal] = useState(false);
  const [openUploadFile, setOpenUploadFile] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = members.map((n) => n.pro_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, pro_id) => {
    const selectedIndex = selected.indexOf(pro_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, pro_id);
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
  const toggle_is_view = async (event, pro_id, is_check) => {
    const _members = members.map((member) => {
      return member.pro_id === pro_id
        ? { ...member, is_check: !member.is_check }
        : member;
    });
    const res = await toggle_is_check(tbl_name, pro_id);
    if (res.data && res.data.affectedRows > 0) {
      displayErrMess("Status updated", "success");
    } else {
      displayErrMess("Server Error! Fail to update status", "error");
    }
    setMembers(_members);
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
        <AdminMemberTableToolBar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          data={members}
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
                      email,
                      point,
                      psid,
                      register_time,
                      is_check,
                      pro_id,
                    } = row;
                    const isItemSelected = selected.indexOf(pro_id) !== -1;
                    return (
                      <TableRow
                        hover
                        key={pro_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={(event) => handleClick(event, pro_id)}
                          />
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

                        <TableCell align="left">
                          {fDateTime(register_time)}
                        </TableCell>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={is_check}
                            onChange={(event) => toggle_is_view(event, pro_id)}
                            disabled={isSuperAdmin() || isPD() ? false : true}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {(isSuperAdmin() || isPD()) && <MemberMoreDetails
                            // setChosenItem={setChosenItem}
                            chosenItem={row}
                            setMembers={setMembers}
                            members={members}
                            update_all_members_func={update_all_members_func}
                            allow_edit={false}
                            allow_resume={true}
                          />}
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
    </>
  );
}

const useStyles = makeStyles({
  cell: {
    maxWidth: "25ch",
    overflow: "hidden",
  },
});
