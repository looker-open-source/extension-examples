import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { QueryParameters } from "../types";

interface CohortLineChartViewProps {
  data: any;
  queryParameters: QueryParameters;
}

const toTitleCase = function(s: string) {
  return `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;
};

const CohortLineChartView: React.FC<CohortLineChartViewProps> = ({
  data,
  queryParameters,
}) => {
  if (!data) {
    return null;
  }

  const series: Array<Highcharts.SeriesOptionsType> = data.map(function(
    row: any
  ) {
    const name = row["user_transactions_monthly.cohort_timeframe"];

    try {
      Object.entries(
        row["user_transactions_monthly.measure"][
          "user_transactions_monthly.cohort_pivot_timeframe"
        ]
      ).sort();
    } catch (e) {
      data;
      e;
    }

    return {
      type: "line",
      name: name,
      data: Object.entries(
        row["user_transactions_monthly.measure"][
          "user_transactions_monthly.cohort_pivot_timeframe"
        ]
      ).sort(),
    } as Highcharts.SeriesOptionsType;
  });

  let legendTitle;
  switch (queryParameters.cohortValue) {
    case "created":
      legendTitle = "Month of User Creation";
      break;
    case "first^_order":
      legendTitle = "Month of First Order";
      break;
  }

  let xAxisTitle;
  switch (queryParameters.cohortTimeframeValue) {
    case "month":
      xAxisTitle = "Months Since";
      break;
    case "quarter":
      xAxisTitle = "Quarters Since";
      break;
  }

  switch (queryParameters.cohortValue) {
    case "created":
      xAxisTitle = `${xAxisTitle} User Created`;
      break;
    case "first^_order":
      xAxisTitle = `${xAxisTitle} First Order`;
      break;
  }

  let yAxisTitle;
  switch (queryParameters.measureValue) {
    case "revenue":
      switch (queryParameters.measureAggregationValue) {
        case "non^_cumulative^_sum":
          yAxisTitle = `Revenue by ${toTitleCase(
            queryParameters.cohortTimeframeValue
          )} ($)`;
          break;
        case "cumulative^_sum":
          yAxisTitle = `Cumulative Revenue ($)`;
          break;
        case "non^_cumulative^_average":
          yAxisTitle = `Average Revenue by ${toTitleCase(
            queryParameters.cohortTimeframeValue
          )} ($)`;
          break;
        case "cumulative^_average":
          yAxisTitle = `Cumulative Average Revenue ($)`;
          break;
      }
      break;
    case "transactions":
      switch (queryParameters.measureAggregationValue) {
        case "non^_cumulative^_sum":
          yAxisTitle = `Transaction Count by ${toTitleCase(
            queryParameters.cohortTimeframeValue
          )}`;
          break;
        case "cumulative^_sum":
          yAxisTitle = `Cumulative Transaction Count`;
          break;
        case "non^_cumulative^_average":
          yAxisTitle = `Average Transaction Count by ${toTitleCase(
            queryParameters.cohortTimeframeValue
          )}`;
          break;
        case "cumulative^_average":
          yAxisTitle = `Cumulative Average Transaction Count`;
          break;
      }
      break;
    case "users":
      switch (queryParameters.measureAggregationValue) {
        case "non^_cumulative^_sum":
          yAxisTitle = `Active User Count by ${toTitleCase(
            queryParameters.cohortTimeframeValue
          )}`;
          break;
        case "cumulative^_sum":
          yAxisTitle = `Cumulative Active User Count by ${toTitleCase(
            queryParameters.cohortTimeframeValue
          )}`;
          break;
        case "non^_cumulative^_average":
          yAxisTitle = `Average Active User Count by ${toTitleCase(
            queryParameters.cohortTimeframeValue
          )}`;
          break;
        case "cumulative^_average":
          yAxisTitle = `Cumulative Average Active User Count`;
          break;
      }
      break;
  }

  queryParameters;

  const options: Highcharts.Options = {
    title: {
      text: undefined,
    },
    legend: {
      title: {
        text: legendTitle,
      },
    },
    series: series,
    xAxis: {
      title: {
        text: xAxisTitle,
      },
    },
    yAxis: {
      title: {
        text: yAxisTitle,
      },
    },
    credits: {
      enabled: false,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default CohortLineChartView;
