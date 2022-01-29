import React, { useEffect, useState } from "react";
import { filter } from "lodash";
// import { Icon } from "@iconify/react";
// import { sentenceCase } from "change-case";
// import plusFill from "@iconify/icons-eva/plus-fill";
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
// ----------------------------------------------------------------------
import { useAuth } from "src/authentication/AuthContext";
import { getAllMembersWithoutAdmin } from "src/mysql_db_api/members";

const TABLE_HEAD = [
  { id: "first_name", label: "First", alignRight: false },
  { id: "last_name", label: "Last", alignRight: false },
  { id: "point", label: "Point", alignRight: false },
  { id: "monthly_point", label: "Monthly Point", alignRight: false },
  { id: "rank", label: "Rank", alignRight: false },
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
      (_user) => _user.psid.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
// ------------------------------------------------------- //
export default function MemberBoard() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("rank");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [members, setMembers] = useState([]);
  const [openNewMember, setOpenNewMemberModal] = useState(false);
  const [openUploadFile, setOpenUploadFile] = useState(false);
  const { setLoading, displayErrMess } = useAuth();

  useEffect(async () => {
    setLoading(true);
    let members_ = await getAllMembersWithoutAdmin();
    try {
      if (members_.data) {
        members_ = members_.data.reverse();
        let cur_rank = 1;
        let cur_point = members_[0].point;
        members_ = members_.map((member, i) => {
          if (member.point > 0) {
            if (member.point === cur_point) {
              // equal
              member.rank = cur_rank;
            } else {
              cur_rank += 1;
              cur_point = member.point;
              member.rank = cur_rank;
            }
          }
          return member;
        });
        setMembers(members_);
      }
    } catch {
      displayErrMess("Fail to Load Members Data!", "error");
    }

    setLoading(false);
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

  // const handleClick = (event, psid) => {
  //   const selectedIndex = selected.indexOf(psid);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, psid);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //   setSelected(newSelected);
  // };

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
            Member Board
          </Typography>
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
                      const { id, first_name, last_name, rank, point, monthly_point, psid } =
                        row;
                      const isItemSelected = selected.indexOf(psid) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
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

                          <TableCell align="left">
                            <Label variant="ghost" color="info">
                              {point}
                            </Label>
                          </TableCell>

                          <TableCell align="left">
                            <Label variant="ghost" color="warning">
                              {monthly_point}
                            </Label>
                          </TableCell>

                          <TableCell align="left" className={classes.cell}>
                            <Label variant="ghost" color="success">
                              #{rank}
                            </Label>
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

const useStyles = makeStyles({
  cell: {
    maxWidth: "25ch",
    overflow: "hidden",
  },
});
