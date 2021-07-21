import React from "react";
import firebase from "firebase";
import { useState } from "react";
import { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const OrderHistory = ({ user, data }) => {
  const classes = useStyles();
  const [data1, setData1] = useState();
  const [total, setTotal] = useState();
  const [date, setDate] = useState(moment(new Date()).format("YYYY.MM.DD"));
  const [check, setCheck] = React.useState({
    checkedA: true,
  });
  useEffect(() => {
    user &&
      firebase
        .database()
        .ref(`orders/history/${user.uid}`)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          const history =
            data &&
            Object.keys(data).map((room) => {
              return data[room];
            });

          setData1(history);

          if (!check.checkedA) {
            const reducer2 =
              data1 &&
              data1.reduce((prev, curr) => {
                return prev + curr.selectedPrice;
              }, 0);
            setTotal(reducer2);
          } else {
            const reducer = !history?.filter((e) => e && e.date === date).length
              ? setTotal(0)
              : history?.filter((e) => e && e.date === date).length === 1
              ? history?.filter((e) => e.date === date)[0].selectedPrice
              : history
                  ?.filter((e) => e && e.date === date)
                  .reduce((prev, curr) => {
                    return prev + curr.selectedPrice;
                  }, 0);
            setTotal(reducer);
          }
        });
  }, [ user, date, check,data1]);

  const handleChange = (event) => {
    setCheck({ ...check, [event.target.name]: event.target.checked });
  };
  const handleDelete = (ind, id) => {
    console.log("1212");
    firebase.database().ref(`/orders/${data.office}/${id}`).remove();
    firebase.database().ref(`/orders/history/${user.uid}/${ind}`).remove();
  };
  console.log(data, "22222");
  return (
    <div style={{ marginTop: "120px" }}>
      <h2>Total:{total} руб</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Switch
          checked={check.checkedA}
          onChange={handleChange}
          name="checkedA"
          inputProps={{ "aria-label": "secondary checkbox" }}
        />

        {check.checkedA && (
          <TextField
            id="date"
            label="Дата"
            type="date"
            defaultValue={moment(new Date()).format("YYYY-MM-DD")}
            onChange={(e) => setDate(e.target.value.replace(/-/g, "."))}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
        {check.checkedA ? (
          <span>История по дате</span>
        ) : (
          <span>Вся история</span>
        )}
      </div>

      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Products</TableCell>
              <TableCell align="right">Руб.</TableCell>
              <TableCell align="right">Отмена заказа.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {check.checkedA ? (
              <>
                {data1 &&
                  data1
                    .filter((e) => e.date === date)
                    .map((e) => (
                      <TableRow key={e.name}>
                        <TableCell component="th" scope="row">
                          {e.date}
                        </TableCell>
                        <TableCell align="right">{e.time}</TableCell>
                        <TableCell align="right">
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {e.selected.map((item, index) => (
                              <span>{item}</span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell align="right">{e.selectedPrice}</TableCell>
                        <TableCell align="right">
                          {e.ind && e.id && (
                            <span
                              onClick={() =>
                                e.ind && e.id && handleDelete(e.ind, e.id)
                              }
                            >
                              Отмена
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
              </>
            ) : (
              <>
                {data1 &&
                  data1.map((e) => (
                    <TableRow key={e.name}>
                      <TableCell component="th" scope="row">
                        {e.date}
                      </TableCell>
                      <TableCell align="right">{e.time}</TableCell>
                      <TableCell align="right">
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {e.selected.map((item, index) => (
                            <span>{item}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell align="right">{e.selectedPrice}</TableCell>
                      <TableCell align="right">
                        {e.ind && e.id && (
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              e.ind && e.id && handleDelete(e.ind, e.id)
                            }
                          >
                            Отмена
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderHistory;
