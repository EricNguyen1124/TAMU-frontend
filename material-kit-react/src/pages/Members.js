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
  MemberMoreDetails,
  MemberTableToolBar,
  MemberToolHeader,
  NewMemberModal,
  MembersUploadFile,
} from "../components/_dashboard/members";
import { fDateTime } from "src/utils/formatTime.js";
import CsvFileExport from "src/components/CsvFileExport";
// ----------------------------------------------------------------------
import { getAllMembers, updateGotShirt, updateInGroupme } from "src/mysql_db_api/members";
import { useAuth } from "src/authentication/AuthContext";

const TABLE_HEAD = [
  { id: "first_name", label: "First", alignRight: false },
  { id: "last_name", label: "Last", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "psid", label: "PSID", alignRight: false },
  // { id: "point", label: "Point", alignRight: false },
  { id: "inGroupme", label: "Joined GM", alignRight: false },
  { id: "gotShirt", label: "Shirt", alignRight: false },
  { id: "updated_time", label: "Updated Time", alignRight: false },
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
        _user.last_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    });
  }
  return stabilizedThis.map((el) => el[0]);
}
// ------------------------------------------------------- //
export default function Member() {
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
  const [openDeleteSelected, setOpenDeleteSelected] = useState(false);

  const { setLoading, displayErrMess, isSuperAdmin, isShirtCheck } = useAuth();

  useEffect(async () => {
    // console.log("init members");
    const members_ = await getAllMembers();
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
      const newSelecteds = members.map((n) => n.psid);
      setSelected(newSelecteds);
      // console.log(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, psid) => {
    const selectedIndex = selected.indexOf(psid); // check if psid already in the selected array
    let newSelected = [];
    if (selectedIndex === -1) {
      // console.log(event);
      // if not in selected array then add current selected and psid to newSelected
      newSelected = newSelected.concat(selected, psid);
    } else if (selectedIndex === 0) {
      // if unselected the psid at position 0, slice from 1 to end
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      // if unselected the psid at the last position, slice from first to end exclusive
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      // in unselected the psid in between, slice from first to position exclusive then position + 1 to end
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    // console.log(newSelected);
    setSelected(newSelected);
  };

  const handleGroupme = async (event, psid, inGroupme) => {
    const _members = members.map((member) => {
      return member.psid === psid
        ? { ...member, inGroupme: !member.inGroupme }
        : member;
    });
    const res = await updateInGroupme(psid);
    if (res.data && res.data.affectedRows > 0) {
      // console.log(res.data);
      displayErrMess("Groupme status updated", "success");
    } else {
      displayErrMess("Server Error! Fail to update Groupme", "error");
    }
    setMembers(_members);
  };

  const handleGotShirt = async (event, psid, gotShirt) => {
    const _members = members.map((member) => {
      return member.psid === psid
        ? { ...member, gotShirt: !member.gotShirt }
        : member;
    });
    const res = await updateGotShirt(psid);
    if (res.data && res.data.affectedRows > 0) {
      // console.log(res.data);
      displayErrMess("Shirt pickup status updated", "success");
    } else {
      displayErrMess("Server Error! Fail to update Shirt status", "error");
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
    <Page title="Member | MISSO">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Members
          </Typography>
          {/* Only isSuperAdmin can delete members */}
          {isSuperAdmin() && selected.length > 0 && (
            <Button
              variant="contained"
              startIcon={<Icon icon="bi:person-x-fill" />}
              style={{ position: "absolute" }}
              onClick={() => setOpenDeleteSelected(true)}
            >
              Delete Selected
            </Button>
          )}
          <DeleteSelectedMembersModal
            selected={selected}
            openDeleteSelected={openDeleteSelected}
            setOpenDeleteSelected={setOpenDeleteSelected}
            members={members}
            setMembers={setMembers}
            setSelected={setSelected}
          />
          {/* Only isSuperAdmin can add/upload new members */}
          {isSuperAdmin() && (
            <div>
              <Button
                variant="contained"
                startIcon={<Icon icon={plusFill} />}
                onClick={() => setOpenNewMemberModal(true)}
              >
                New Member
              </Button>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                style={{ marginLeft: "5px" }}
                onClick={() => setOpenUploadFile(true)}
              >
                Upload Members
              </Button>
              <CsvFileExport data={members} fileName="member_data" />
            </div>
          )}
        </Stack>

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
                        // memberstatus,
                        email,
                        // cougar_email,
                        //point,
                        psid,
                        inGroupme,
                        gotShirt,
                        // monthly_point,
                        // classification,
                        updated_time,
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
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, psid)}
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
                          {/* Set Groupme */}
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={inGroupme}
                              onChange={(event) => handleGroupme(event, psid)}
                              disabled={isSuperAdmin() ? false : true}
                            />
                            {/* Set picked up shirt */}
                          </TableCell>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={gotShirt}
                              onChange={(event) => handleGotShirt(event, psid)}
                              disabled={isShirtCheck() ? false : true}
                            />
                          </TableCell>

                          {/* <TableCell align="left">
                            <Label variant="ghost" color="success">
                              {point}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color="warning">
                              {monthly_point}
                            </Label>
                          </TableCell> */}
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

                          <TableCell align="right">
                            <MemberMoreDetails
                              // setChosenItem={setChosenItem}
                              chosenItem={row}
                              setMembers={setMembers}
                              members={members}
                              update_all_members_func={getAllMembers}
                              allow_edit={true}
                              allow_delete={true}
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
import { exportDataCsv } from "src/utils/myutils";
import DeleteSelectedMembersModal from "src/components/_dashboard/members/DeleteSelectedMembersModal";

const useStyles = makeStyles({
  cell: {
    maxWidth: "25ch",
    overflow: "hidden",
  },
});
