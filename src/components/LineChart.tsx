import React, { useEffect, useState } from "react";
import { select, Selection } from "d3-selection";

import { scaleTime, scaleLinear } from "d3-scale";
import { axisLeft, axisBottom } from "d3-axis";
import { max } from "d3-array";
import { line } from "d3-shape";
import "d3-transition";

type Props = {
    data: Data[];
    setUpdate: (d: boolean) => void;
    updated: boolean;
};

type D3Selection = Selection<SVGSVGElement | null, {}, null, undefined>;
type D3PathSelection = Selection<SVGPathElement | null, {}, null, undefined>;

const LineChart: React.FunctionComponent<Props> = (props: Props) => {
    //REFS
    const chartRef = React.createRef<SVGPathElement>();
    const leftAxisRef = React.createRef<SVGSVGElement>();
    const botAxisRef = React.createRef<SVGSVGElement>();

    //SVG RELATED CONSTANTS
    const margin = { top: 10, left: 100, bottom: 100 };
    const graphHeight = 600 - margin.top - margin.bottom;
    const graphWidth = 900 - margin.left;
    const y = scaleLinear().range([graphHeight, 0]);
    const x = scaleTime().range([0, graphWidth]);
    const lineGenerator = line<Data>()
        .x(d => x(d.date))
        .y(d => y(d.amount));

    //
    const [sortedData, setData] = useState<Data[]>([]);
    const [mount, setMount] = useState(false);
    const [
        graphSelection,
        setgraphSelection
    ] = useState<D3PathSelection | null>(null);
    const [lAxisSelection, setLAxisSelection] = useState<D3Selection | null>(
        null
    );
    const [bAxisSelection, setBAxisSelection] = useState<D3Selection | null>(
        null
    );

    useEffect(() => {
        const mounted =
            mount && graphSelection && lAxisSelection && bAxisSelection;
        if (!mounted) {
            setLAxisSelection(select(leftAxisRef.current));
            setBAxisSelection(select(botAxisRef.current));
            setgraphSelection(select(chartRef.current));
            setMount(true);
        }
        if (props.data && props.updated) {
            let sorted = props.data.concat().sort((a, b) => {
                if (a.date > b.date) {
                    return -1;
                }
                return 1;
            });
            setData(sorted);
            props.setUpdate(false);
        }
        renderChartAndAxis();
    });

    const renderChartAndAxis = () => {
        if (lAxisSelection && bAxisSelection && graphSelection) {
            y.domain([0, max(sortedData, d => d.amount) || 0]);
            x.domain([minDate(sortedData)!, maxDate(sortedData)!]);

            const xAxis = axisBottom(x);
            const yAxis = axisLeft(y);

            const botAxis = bAxisSelection.attr(
                "transform",
                `translate(${margin.left}, ${graphHeight + margin.top})`
            );

            const leftAxis = lAxisSelection.attr(
                "transform",
                `translate(${margin.left}, ${margin.top})`
            );

            botAxis.call(xAxis as any);
            leftAxis.call(yAxis as any);
            graphSelection
                .datum(sortedData)
                .exit()
                .remove();

            graphSelection

                .datum(sortedData)
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .transition()
                .duration(450)
                // .enter()
                .attr("stroke", "blue")
                .attr("fill", "none")
                .attr("d", lineGenerator as any);
        }
    };

    return (
        <svg width={1000} height={700}>
            <path ref={chartRef} />
            <g ref={botAxisRef} />
            <g ref={leftAxisRef} />
        </svg>
    );
};

const maxDate = (dates: Data[]) => {
    let maxDate: Date | null = null;
    dates.forEach((datum, i) => {
        if (i == 0) {
            maxDate = datum.date;
        } else if (maxDate && datum.date > maxDate) {
            maxDate = datum.date;
        }
    });
    return maxDate;
};

const minDate = (dates: Data[]) => {
    let minDate: Date | null = null;
    dates.forEach((datum, i) => {
        if (i == 0) {
            minDate = datum.date;
        } else if (minDate && datum.date < minDate) {
            minDate = datum.date;
        }
    });
    return minDate;
};

export default LineChart;
