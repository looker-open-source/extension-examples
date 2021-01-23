import React, { useContext } from "react";
import styled from "styled-components";
import {
  ComponentsProvider,
  Box,
  Heading,
  Card,
  CardContent,
} from "@looker/components";
import {
  ExtensionContext,
  ExtensionContextData,
} from "@looker/extension-sdk-react";
import { ILookmlModelExplore } from "@looker/sdk";
import QueryDisplay from "./Components/QueryDisplay";
import CohortPicker from "./Components/CohortPicker";
import DEFAULTS from "./defaults";
import { QueryParameters, TableStyle, QueryDisplayView } from "./types";
import { DEFAULT_QUERY_DISPLAY_VIEW, DEFAULT_TABLE_STYLE } from "./constants";

export const Cohort: React.FC = () => {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext);
  const { core31SDK } = extensionContext;

  const [explore, setExplore] = React.useState<ILookmlModelExplore>();

  const [measureValue, setMeasureValue] = React.useState<string>(
    DEFAULTS.CONTROLS.MEASURE_VALUE
  );
  const [cohortValue, setCohortValue] = React.useState<string>(
    DEFAULTS.CONTROLS.COHORT_VALUE
  );
  const [cohortTimeframeValue, setCohortTimeframeValue] = React.useState<
    string
  >(DEFAULTS.CONTROLS.COHORT_TIMEFRAME_VALUE);
  const [measureAggregationValue, setMeasureAggregationValue] = React.useState<
    string
  >(DEFAULTS.CONTROLS.MEASURE_AGGREGATION_VALUE);

  const [queryIsRunning, setQueryIsRunning] = React.useState<boolean>(false);
  const [queryId, setQueryId] = React.useState<string>();

  const [currentView, setCurrentView] = React.useState<QueryDisplayView>(
    DEFAULT_QUERY_DISPLAY_VIEW
  );
  const [currentTableStyle, setCurrentTableStyle] = React.useState<TableStyle>(
    DEFAULT_TABLE_STYLE
  );

  React.useEffect(() => {
    const [modelName, exploreName] = DEFAULTS.EXPLORE_IDENTIFIER.split("::");
    core31SDK
      .lookml_model_explore(modelName, exploreName)
      .then((response: any) => {
        if (response.ok) {
          setExplore(response.value);
        }
      });
  }, [DEFAULTS.EXPLORE_IDENTIFIER]);

  const queryParameters: QueryParameters = {
    measureValue,
    cohortValue,
    cohortTimeframeValue,
    measureAggregationValue,
  };

  return (
    <ComponentsProvider>
      <Box bg="palette.charcoal100" height="100%">
        <HeadingBox px="medium" pt="xxlarge" textAlign="center">
          <HeadingTitle>Cohort Analysis</HeadingTitle>
        </HeadingBox>
        <Box px="xxxlarge" pb="xxlarge">
          <CohortCard raised mx="xxxlarge">
            <CardContent p="xlarge">
              <Box mb="small">
                {explore && queryId && (
                  <CohortPicker
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    currentTableStyle={currentTableStyle}
                    setCurrentTableStyle={setCurrentTableStyle}
                    queryIsRunning={queryIsRunning}
                    explore={explore}
                    queryId={queryId}
                    measureValue={measureValue}
                    setMeasureValue={setMeasureValue}
                    cohortValue={cohortValue}
                    setCohortValue={setCohortValue}
                    cohortTimeframeValue={cohortTimeframeValue}
                    setCohortTimeframeValue={setCohortTimeframeValue}
                    measureAggregationValue={measureAggregationValue}
                    setMeasureAggregationValue={setMeasureAggregationValue}
                  />
                )}
              </Box>
              <QueryDisplay
                currentTableStyle={currentTableStyle}
                currentView={currentView}
                queryParameters={queryParameters}
                setQueryId={setQueryId}
                setQueryIsRunning={setQueryIsRunning}
              />
            </CardContent>
          </CohortCard>
        </Box>
      </Box>
    </ComponentsProvider>
  );
};

const CohortCard = styled(Card)`
  margin-top: -40px;
  height: auto;
`;

const HeadingTitle = styled(Heading).attrs({
  fontSize: "xxlarge",
  fontWeight: "normal",
  as: "h1",
  mb: "small",
  textAlign: "center",
  py: "small",
  px: "medium",
})`
  color: #fff;
  border: 3px solid;
  display: inline-block;
`;

const HeadingBox = styled(Box)`
  background-image: linear-gradient(
    45deg,
    #3f51b1 0%,
    #5a55ae 13%,
    #7b5fac 25%,
    #8f6aae 38%,
    #a86aa4 50%,
    #cc6b8e 62%,
    #f18271 75%,
    #f3a469 87%,
    #f7c978 100%
  );
  padding-bottom: 4rem;
`;
