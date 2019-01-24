import React, { useState } from "react";
import Add from "./Add";
import List from "./List";
import LineChart from "./LineChart";

const Container: React.FunctionComponent = () => {
    const [data, setData] = useState<Data[]>([
        {
            date: new Date("December 17, 2018"),
            amount: 800
        },
        {
            date: new Date("December 20, 2018"),
            amount: 500
        }
    ]);
    const [updated, setUpdate] = useState(true);

    return (
        <div>
            <Add data={data} updateData={setData} setUpdate={setUpdate} />
            <List data={data} />
            <LineChart data={data} setUpdate={setUpdate} updated={updated} />
        </div>
    );
};

export default Container;
