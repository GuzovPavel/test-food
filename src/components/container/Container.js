import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  Checkbox,
  Paper,
  Typography,
  Toolbar,
  TableSortLabel,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Button,
} from "@material-ui/core";
import Clock from "react-live-clock";
import Modal from "../modal";
import firebase from "firebase";
import './Container.scss'

function createData(name, price) {
  return { name, price };
}

const rows = [createData("loading", 0)];

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

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Блюдо",
  },
  { id: "gr", numeric: true, disablePadding: false, label: "Грамм" },
  { id: "cal", numeric: true, disablePadding: false, label: "ккал" },

  { id: "price", numeric: true, disablePadding: false, label: "Цена(р)" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead >
      <TableRow>
        <TableCell  padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const [day, setDay] = useState("");
  const { numSelected, block } = props;
  const hour = parseInt(new Date().toLocaleTimeString().split(":")[0]);
  const min = parseInt(new Date().toLocaleTimeString().split(":")[1]);
  useEffect(() => {
    firebase
      .database()
      .ref(`day/i`)
      .on("value", (snapshot) => {
        const data1 = snapshot.val();
        setDay(data1);
      });
  }, []);
  useEffect(() => {
    if (hour === 9 && min === 30) {
      let newTemplate = firebase.database().ref(`/block`);
      newTemplate.update({ i: false });
      return;
    }
  }, [hour,min]);

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          style={{ display: "flex", flexFlow: "column" }}
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <span>
            Меню на:
            {(day === "monday" && " понедельник") ||
              (day === "tuesday" && " вторник") ||
              (day === "wednesday" && " среду") ||
              (day === "thursday" && " четверг") ||
              (day === "friday" && " пятницу")}
          </span>
          {!block ? (
            <span className="time-is-over">
              Время вышло, попробуйте завтра до 9-30 утра
            </span>
          ) : (
            <Clock
              format={"HH:mm:ss"}
              ticking={false}
              timezone={"Europe/Moscow"}
            />
          )}
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "40px auto",
    maxWidth: "1024px",
  },
  paper: {
    width: "100%",
    borderRadius: '10px',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 320,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export const Container = ({ user, data }) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");
  const [selected, setSelected] = React.useState([]);
  const [priceArr, setPriceArr] = React.useState([]);
  const [block, isBlock] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const [day, setDay] = useState();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const [data1, setData] = useState();
  let arr2 = data1 ? data1.selected : rows;
  const handleDay = (i) => {
    let newTemplate = firebase.database().ref(`/day`);
    newTemplate.update({ i });
  };
  useEffect(() => {
    firebase
      .database()
      .ref(`day/i`)
      .on("value", (snapshot) => {
        const data1 = snapshot.val();
        setDay(data1);
        firebase
          .database()
          .ref(`menu/`)
          .on("value", (snapshot) => {
            const data = snapshot.val();
            setData(data[data1]);
          });
        firebase
          .database()
          .ref(`block/`)
          .on("value", (snapshot) => {
            const data = snapshot.val();
            isBlock(data.i);
          });
      });
  }, [ day]);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = arr2.map((n) => n.name);
      const newSelectedsPrice = arr2.map((n) => n.price);
      setSelected(newSelecteds);
      setPriceArr(newSelectedsPrice);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, price) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    let selectedPrice = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
      selectedPrice = selectedPrice.concat(priceArr, price);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      selectedPrice = selectedPrice.concat(priceArr.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      selectedPrice = selectedPrice.concat(priceArr.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      selectedPrice = selectedPrice.concat(
        priceArr.slice(0, selectedIndex),

        priceArr.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);

    setPriceArr(selectedPrice);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}>

      {data && data.admin === true && (
        <div>
          <h2 className='main-menu'>Меню</h2>
          <select className='today-day'
            onChange={(e) => {
              setDay(e.target.value);
              handleDay(e.target.value);
            }}
            name="select"
            value={day}
          >
            <option value="monday">Понедельник</option>
            <option value="tuesday">Вторник</option>
            <option value="wednesday">Среда</option>
            <option value="thursday">Четверг</option>
            <option value="friday">Пятница</option>
          </select>
        </div>
      )}
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selected={selected}
        selectedPrice={priceArr}
        user={user}
        data={data}
      />
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} block={block} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={arr2.length}
            />
            <TableBody>
              {stableSort(arr2, getComparator(order, orderBy)).map(
                (row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                    className="choise"
                      hover
                      onClick={(event) =>
                        handleClick(event, row.name, row.price)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            margin: "10px 0px",
                          }}
                        >
                          {row.name}
                          {/* <img
                            style={{ width: "120px" }}
                            src={row.img}
                            alt={row.img}
                          ></img> */}
                        </div>
                      </TableCell>
                      <TableCell align="right">{row.gr}</TableCell>
                      <TableCell align="right">{row.cal}</TableCell>

                      <TableCell align="right">{row.price}</TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Button
        onClick={() => {
          block && setIsOpen(true);
        }}
        variant="contained"
        color="primary"
      >
        Заказать
      </Button>
    </div>
  );
};
