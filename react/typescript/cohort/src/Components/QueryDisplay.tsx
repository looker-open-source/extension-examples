import React, { useContext } from "react";
import {
  ExtensionContext,
  ExtensionContextData,
} from "@looker/extension-sdk-react";
import { IWriteQuery } from "@looker/sdk";
import CohortTableView from "./CohortTableView";
import CohortLineChartView from "./CohortLineChartView";
import { QueryParameters } from "../types";
import { TableStyle, QueryDisplayView } from "../types";

interface QueryDisplayProps {
  queryParameters: QueryParameters;
  currentView: QueryDisplayView;
  currentTableStyle: TableStyle;
  setQueryId: (queryId: string) => void;
  setQueryIsRunning: (queryIsRunning: boolean) => void;
}

const QueryDisplay: React.FC<QueryDisplayProps> = ({
  currentView,
  currentTableStyle,
  queryParameters,
  setQueryId,
  setQueryIsRunning,
}) => {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext);
  const { core31SDK } = extensionContext;

  const {
    measureValue,
    cohortValue,
    cohortTimeframeValue,
    measureAggregationValue,
  } = queryParameters;
  const [savedQuery, setSavedQuery] = React.useState<any>();
  const [queryResults, setQueryResults] = React.useState<any>();

  React.useEffect(() => {
    if (
      !measureValue ||
      !cohortValue ||
      !cohortTimeframeValue ||
      !measureAggregationValue
    ) {
      return;
    }

    (async () => {
      const querySpec: IWriteQuery = {
        model: "thelook",
        view: "users_cohorts",
        fields: [
          "user_transactions_monthly.cohort_pivot_timeframe",
          "user_transactions_monthly.cohort_timeframe",
          "user_transactions_monthly.measure",
        ],
        pivots: ["user_transactions_monthly.cohort_pivot_timeframe"],
        filters: {
          "user_transactions_monthly.cohort_action_picker": cohortValue,
          "user_transactions_monthly.cohort_pivot_timeframe": "--%,-NULL",
          "user_transactions_monthly.cohort_timeframe_picker": cohortTimeframeValue,
          "user_transactions_monthly.measure_aggregation_picker": measureAggregationValue,
          "user_transactions_monthly.measure_picker": measureValue,
        },
        sorts: [
          "ser_transactions_monthly.cohort_pivot_timeframe 0",
          "user_transactions_monthly.cohort_timeframe",
        ],
      };

      setSavedQuery(await core31SDK.ok(core31SDK.create_query(querySpec)));
    })();
  }, [
    measureValue,
    cohortValue,
    cohortTimeframeValue,
    measureAggregationValue,
  ]);

  React.useEffect(() => {
    if (!savedQuery) {
      return;
    }

    (async () => {
      setQueryIsRunning(true);
      setQueryResults(
        await core31SDK.ok(
          core31SDK.run_query({
            query_id: savedQuery.id,
            result_format: "json",
          })
        )
      );
      setQueryIsRunning(false);
    })();
  }, [savedQuery]);

  React.useEffect(() => {
    if (!savedQuery) {
      return;
    }
    setQueryId(savedQuery.client_id);
  }, [savedQuery]);

  return (
    <>
      {(() => {
        switch (currentView) {
          case "TableView":
            return (
              <CohortTableView
                data={queryResults}
                queryParameters={queryParameters}
                tableStyle={currentTableStyle}
              />
            );
          case "LineChartView":
            return (
              <CohortLineChartView
                data={queryResults}
                queryParameters={queryParameters}
              />
            );
        }
      })()}
    </>
  );
};

export default QueryDisplay;
