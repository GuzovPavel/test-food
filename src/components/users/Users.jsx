import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import firebase from "firebase";
import { useSelector, useDispatch } from "react-redux";
import { setId } from "../../redux/actions/mainActions";
import { Link } from "react-router-dom";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const Users = () => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const id = useSelector((state) => state.main.id);
  const [data1, setData] = useState();
  useEffect(() => {
    firebase
      .database()
      .ref(`users/`)
      .on("value", (snapshot) => {
        const data = snapshot.val();
        const history =
          data &&
          Object.keys(data).map((room) => {
            return data[room];
          });
        setData(history);
      });
  }, []);
  return (
    <div
      style={{
        marginTop: "120px",
        marginBottom: "120px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <TableContainer style={{ width: "50%" }} component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Фамилия</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell align="right">Оффис</TableCell>
              <TableCell align="right">Почта</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data1 &&
              data1.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <Link
                      to="/user-history"
                      onClick={() => dispatch(setId(row.uid))}
                    >
                      {row.name}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.lastName}</TableCell>
                  <TableCell align="right">
                    {(row.office === "alex" && "Александровская") ||
                      (row.office === "cheh" && "Чехова") ||
                      (row.office === "grech" && "Греческая") ||
                      (row.office === "petr" && "Петровская")}
                  </TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
