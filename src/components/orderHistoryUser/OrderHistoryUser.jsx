import React from "react";
import firebase from "firebase";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Switch
} from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const OrderHistoryUser = () => {
  const classes = useStyles();
  const [data1, setData1] = useState();
  const [total, setTotal] = useState();
  const [date, setDate] = useState(moment(new Date()).format("YYYY.MM.DD"));
  const [check, setCheck] = React.useState({
    checkedA: true,
  });
  const id = useSelector((state) => state.main.id);
  const style = { 
    fontSize: '23px',
    fontWeight: 600,
    margin:'15px 0'
  }

  useEffect(() => {
    firebase
      .database()
      .ref(`orders/history/${id}`)
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
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, check, id]);

  const handleChange = (event) => {
    setCheck({ ...check, [event.target.name]: event.target.checked });
  };
  return (
    <div style={{ marginTop: "120px" }}>
      <h2>Total:{total} ??????</h2>
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
            label="????????"
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
          <span style={style}>?????????????? ???? ????????</span>
        ) : (
          <span style={style}>?????? ??????????????</span>
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
              <TableCell align="right">??????.</TableCell>
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

export default OrderHistoryUser;
