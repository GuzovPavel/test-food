import React, { useEffect, useState } from "react";

import firebase from "firebase";
const ListOrders = () => {
  const [dataGrech, setDataGrech] = useState();
  const [dataAlex, setDataAlex] = useState();
  const [dataCheh, setDataCheh] = useState();
  const [dataPetr, setDataPetr] = useState();
  useEffect(() => {
    firebase
      .database()
      .ref(`orders/`)
      .on("value", (snapshot) => {
        const data = snapshot.val();
        const arrayGrech =
          data.grech &&
          Object.keys(data.grech).map((room) => {
            return { item: data.grech[room] };
          });
        const arrayAlex =
          data.alex &&
          Object.keys(data.alex).map((room) => {
            return { item: data.alex[room] };
          });
        const arrayCheh =
          data.cheh &&
          Object.keys(data.cheh).map((room) => {
            return { item: data.cheh[room] };
          });
        const arrayPetr =
          data.petr &&
          Object.keys(data.petr).map((room) => {
            return { item: data.petr[room] };
          });

        const tmp1 = [];

        data.grech &&
          arrayGrech.forEach((e) => {
            Array.isArray(e.item) &&
              e.item.forEach((elem) => {
                tmp1.push(elem);
              });
            var v,
              freqs = {};

            for (var i = tmp1 && tmp1.length; i--; ) {
              v = tmp1[i];
              if (freqs[v]) freqs[v] += 1;
              else freqs[v] = 1;
            }
            const arrayGrech2 = Object.keys(freqs).map((room) => {
              return { name: room, num: freqs[room] };
            });
            setDataGrech(arrayGrech2);
          });
        const tmp2 = [];
        data.alex &&
          arrayAlex.forEach((e) => {
            Array.isArray(e.item) &&
              e.item.forEach((elem) => {
                tmp2.push(elem);
              });
            var v,
              freqs = {};

            for (var i = tmp2 && tmp2.length; i--; ) {
              v = tmp2[i];
              if (freqs[v]) freqs[v] += 1;
              else freqs[v] = 1;
            }
            const arrayAlex2 = Object.keys(freqs).map((room) => {
              return { name: room, num: freqs[room] };
            });
            setDataAlex(arrayAlex2);
          });
        const tmp3 = [];
        data.cheh &&
          arrayCheh.forEach((e) => {
            Array.isArray(e.item) &&
              e.item.forEach((elem) => {
                tmp3.push(elem);
              });
            var v,
              freqs = {};

            for (var i = tmp3 && tmp3.length; i--; ) {
              v = tmp3[i];
              if (freqs[v]) freqs[v] += 1;
              else freqs[v] = 1;
            }
            const arrayCheh2 = Object.keys(freqs).map((room) => {
              return { name: room, num: freqs[room] };
            });
            setDataCheh(arrayCheh2);
          });
        const tmp4 = [];
        data.petr &&
          arrayPetr.forEach((e) => {
            Array.isArray(e.item) &&
              e.item.forEach((elem) => {
                tmp4.push(elem);
              });
            var v,
              freqs = {};

            for (var i = tmp4 && tmp4.length; i--; ) {
              v = tmp4[i];
              if (freqs[v]) freqs[v] += 1;
              else freqs[v] = 1;
            }
            const arrayPetr2 = Object.keys(freqs).map((room) => {
              return { name: room, num: freqs[room] };
            });
            setDataPetr(arrayPetr2);
          });
      });
    
  }, []);

  return (
    <div style={{ marginTop: "120px", marginBottom: "120px" }}>
      <h2>Греческая</h2>
      {dataGrech &&
        dataGrech.map((item, index) => (
          <p>
            {item.name}-{item.num}
          </p>
        ))}
      <h2>Чехова</h2>
      {dataCheh &&
        dataCheh.map((item, index) => (
          <p>
            {item.name}-{item.num}
          </p>
        ))}
      <h2>Александровская</h2>
      {dataAlex &&
        dataAlex.map((item, index) => (
          <p>
            {item.name}-{item.num}
          </p>
        ))}
      <h2>Петровская</h2>
      {dataPetr &&
        dataPetr.map((item, index) => (
          <p>
            {item.name}-{item.num}
          </p>
        ))}
      {/* сумма:{sum && sum.reduce((partial_sum, a) => partial_sum + a, 0)} */}
    </div>
  );
};

export default ListOrders;
