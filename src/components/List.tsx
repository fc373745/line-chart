import React from "react";

type Props = {
    data: Data[];
};

const List: React.FunctionComponent<Props> = (props: Props) => {
    return (
        <ul>
            {props.data.map(datum => (
                <li key={datum.date.toDateString()}>
                    {`${datum.date.toDateString()} | ${datum.amount}`}
                </li>
            ))}
        </ul>
    );
};

export default List;
