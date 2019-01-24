import React, { useState } from "react";
import DatePicker, { setDefaultLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

type Props = {
    data: Data[];
    updateData: (d: Data[]) => void;
    setUpdate: (d: boolean) => void;
};

const Add: React.FunctionComponent<Props> = (props: Props) => {
    const [date, setDate] = useState<Date>(new Date());
    const [amt, setAmt] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (/^[0-9]*$/.test(e.target.value)) {
            const amount = parseInt(e.target.value);
            setAmt(amount);
        }
    };

    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const list = [
            ...props.data,
            {
                date,
                amount: amt
            }
        ];
        props.updateData(list);
        props.setUpdate(true);
        setAmt(0);
    };

    return (
        <form>
            Date:{" "}
            <DatePicker
                selected={date}
                onChange={selectedDate => setDate(selectedDate as any)}
            />
            <br />
            Amount: <input value={amt || ""} onChange={handleChange} />
            <br />
            <button type="submit" onClick={submit}>
                Add
            </button>
        </form>
    );
};

export default Add;
