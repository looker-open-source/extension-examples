import * as React from "react";
import styled from "styled-components";
import {
  Box,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableDataCell,
  TableRow,
} from "@looker/components";
import { QueryParameters } from "../types";
import * as d3 from "d3";
import { TableStyle } from "../types";

const MONTH_LIMIT = 12;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Example data:
 *
 * [
 *    {
 *      "user_transactions_monthly.cohort_timeframe": "2016-01",
 *      "user_transactions_monthly.measure": {
 *        "user_transactions_monthly.cohort_pivot_timeframe": {
 *          "10": 0.7725,
 *          "11": 13.995833333333335,
 *          "12": 16.383333333333333,
 *          "13": 23.3325,
 *          ...
 *        }
 *      }
 *    },
 *    ...
 * ]
 */

interface TableViewProps {
  data: any;
  queryParameters: QueryParameters;
  tableStyle: TableStyle;
}

const formatCohortDate = (date: string) => {
  const parsedDate = new Date(date);
  return `${MONTHS[parsedDate.getMonth()]} ${parsedDate.getFullYear()}`;
};

const CohortTableView: React.FC<TableViewProps> = ({ data, tableStyle }) => {
  if (!data) {
    return null;
  }

  const values: any[] = []; // for computing quantiles for colorization

  const header = ["Date"].concat(
    Object.keys(
      data[0]["user_transactions_monthly.measure"][
        "user_transactions_monthly.cohort_pivot_timeframe"
      ]
    )
      .sort()
      .slice(0, MONTH_LIMIT)
      .map(function(stringMonthsSince) {
        const numberMonthsSince = parseInt(stringMonthsSince);
        return `Month ${numberMonthsSince}`;
      })
  );

  const rows = data.map(function(dataRow: any) {
    const result = [];
    const timeframe = formatCohortDate(
      dataRow["user_transactions_monthly.cohort_timeframe"]
    );
    result.push(timeframe);

    Object.keys(
      dataRow["user_transactions_monthly.measure"][
        "user_transactions_monthly.cohort_pivot_timeframe"
      ]
    )
      .sort()
      .slice(0, MONTH_LIMIT)
      .forEach(function(monthsSince) {
        const cell =
          dataRow["user_transactions_monthly.measure"][
            "user_transactions_monthly.cohort_pivot_timeframe"
          ][monthsSince];
        const rounded = Number.parseFloat(cell).toPrecision(4);
        if (typeof cell === "number" && cell !== NaN) {
          values.push(cell);
        }
        result.push(rounded === "NaN" ? cell : rounded.toString());
      });

    return result;
  });

  const colorizer = (d3 as any)
    .scaleSequentialQuantile(d3.interpolateRdYlBu)
    .domain(values);

  const textColorizer = (color: any) => {
    if (!color) {
      return "";
    }

    // "rgb(244, 121, 72)"
    let parsedColor: string[] = ["", "", ""];
    const match = color.match(
      /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i
    );
    if (match) {
      parsedColor = [match[1], match[2], match[3]];
    }

    // http://www.w3.org/TR/AERT#color-contrast
    const o = Math.round(
      (parseInt(parsedColor[0]) * 299 +
        parseInt(parsedColor[1]) * 587 +
        parseInt(parsedColor[2]) * 114) /
        1000
    );
    return o > 125 ? "black" : "white";
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          {header.map(function(value, idx) {
            return (
              <TableHeaderCell key={`${idx}-${value}`} fontSize="xsmall">
                {value}
              </TableHeaderCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(function(row: any, idx: number) {
          return (
            <TableRow key={`row-${idx}`}>
              {(() => {
                let firstCohortValue: any;
                return row.map(function(cell: any, idx: number) {
                  let value = parseFloat(cell);
                  const bgColor = value === NaN ? null : colorizer(value);
                  const fgColor = textColorizer(bgColor);

                  if (idx === 1 && typeof value === "number" && !isNaN(value)) {
                    firstCohortValue = value;
                  }

                  if (
                    tableStyle === "Percentage" &&
                    typeof value === "number" &&
                    !isNaN(value) &&
                    firstCohortValue
                  ) {
                    const percentage = (
                      (value / firstCohortValue) *
                      100
                    ).toPrecision(4);
                    cell = `${percentage}%`;
                  }

                  return (
                    <OverriddenTableDataCell
                      key={`${idx}-${cell}`}
                      fontSize="xsmall"
                      bg={bgColor}
                      color={fgColor}
                    >
                      <DataCell textAlign="right">{cell}</DataCell>
                    </OverriddenTableDataCell>
                  );
                });
              })()}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const OverriddenTableDataCell = styled(TableDataCell)`
  border-top: none;
`;

const DataCell = styled(Box)`
  margin-right: 5px;
`;

export default CohortTableView;
