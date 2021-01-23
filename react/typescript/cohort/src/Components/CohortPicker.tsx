import React, { useContext } from "react";
import { ILookmlModelExplore, ILookmlModelExploreField } from "@looker/sdk";
import {
  ExtensionContext,
  ExtensionContextData,
} from "@looker/extension-sdk-react";
import CohortPickerField from "./CohortPickerField";
import styled from "styled-components";
import {
  IconButton,
  Icon,
  Flex,
  Spinner,
  ButtonToggle,
  ButtonItem,
} from "@looker/components";
import { QueryDisplayView, TableStyle } from "../types";

const LOOKML_COHORT_TAGS = {
  measurePicker: "cohort__measure_picker",
  measureAggregationPicker: "cohort__measure_aggregation_picker",
  cohortTimeframePicker: "cohort__cohort_timeframe_picker",
  cohortActionPicker: "cohort__cohort_action_picker",
  cohortTimeframe: "cohort__cohort_timeframe",
  cohortPivotTimeframe: "cohort__cohort_pivot_timeframe",
};

/**
 * * see if we can add white border for each data cell or remove border entirely
 */

interface CohortPickerProps {
  queryIsRunning: boolean;
  explore: ILookmlModelExplore;
  queryId: string;
  measureValue: string;
  setMeasureValue: (value: string) => void;
  cohortValue: string;
  setCohortValue: (value: string) => void;
  cohortTimeframeValue: string;
  setCohortTimeframeValue: (value: string) => void;
  measureAggregationValue: string;
  setMeasureAggregationValue: (value: string) => void;
  currentView: QueryDisplayView;
  setCurrentView: (v: QueryDisplayView) => void;
  currentTableStyle: TableStyle;
  setCurrentTableStyle: (value: TableStyle) => void;
}

const setValue = (setter: (value: string) => void) => {
  return (e: React.FormEvent<HTMLSelectElement>) => {
    setter(e.currentTarget.value);
  };
};

const CohortPicker: React.FC<CohortPickerProps> = ({
  queryIsRunning,
  explore,
  queryId,
  measureValue,
  setMeasureValue,
  cohortValue,
  setCohortValue,
  cohortTimeframeValue,
  setCohortTimeframeValue,
  measureAggregationValue,
  setMeasureAggregationValue,
  currentView,
  setCurrentView,
  currentTableStyle,
  setCurrentTableStyle,
}) => {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext);
  const { extensionSDK } = extensionContext;

  const fetchFieldByTag = (() => {
    const allFields: ILookmlModelExploreField[] = []
    if (explore.fields?.dimensions) {
      allFields.push(...explore.fields.dimensions)
    }
    if (explore.fields?.measures) {
      allFields.push(...explore.fields.measures)
    }
    if (explore.fields?.filters) {
      allFields.push(...explore.fields.filters)
    }
    if (explore.fields?.parameters) {
      allFields.push(...explore.fields.parameters)
    }

    return (tag: string) => {
      const matchingFields = allFields.filter(function(
        field: ILookmlModelExploreField
      ) {
        return field.tags && field.tags.indexOf(tag) > -1;
      });

      switch (matchingFields.length) {
        case 0:
          console.warn(`Could not find any fields tagged \`${tag}\``);
          break;
        case 1:
          break;
        default:
          console.warn(`Found more than one field tagged \`${tag}\``);
      }

      return matchingFields[0];
    };
  })();

  const openExplore = () => {
    if (!queryId) {
      return;
    }
    const path = `/explore/${explore.model_name}/${explore.view_name}?qid=${queryId}`;
    extensionSDK.updateLocation(path);
  };

  const handleTableStyleChange = (value: string) => {
    switch (value) {
      case "Absolute":
        setCurrentTableStyle("Absolute");
        break;
      case "Percentage":
        setCurrentTableStyle("Percentage");
        break;
    }
  };

  return (
    <Flex alignItems="center">
      <CohortChoices>
        <CohortPickerField
          field={fetchFieldByTag(LOOKML_COHORT_TAGS.measurePicker)}
          label={"Measure"}
          onChange={setMeasureValue}
          value={measureValue}
        />
        <CohortPickerField
          field={fetchFieldByTag(LOOKML_COHORT_TAGS.cohortActionPicker)}
          label={"Date"}
          onChange={setCohortValue}
          value={cohortValue}
        />
        <CohortPickerField
          field={fetchFieldByTag(LOOKML_COHORT_TAGS.cohortTimeframePicker)}
          label={"Interval"}
          onChange={setCohortTimeframeValue}
          value={cohortTimeframeValue}
        />
        <CohortPickerField
          field={fetchFieldByTag(LOOKML_COHORT_TAGS.measureAggregationPicker)}
          label="Aggregation"
          onChange={setMeasureAggregationValue}
          value={measureAggregationValue}
        />
      </CohortChoices>
      {queryIsRunning && <Spinner />}

      <Flex marginLeft="auto" justifyItems="center">
        <ButtonToggle
          value={currentTableStyle}
          onChange={handleTableStyleChange}
          mr="medium"
        >
          <ButtonItem value="Percentage">%</ButtonItem>
          <ButtonItem value="Absolute">#</ButtonItem>
        </ButtonToggle>
        <ViewToggleIconButton
          mr="xsmall"
          shape="round"
          outline
          label="Table"
          icon="VisTable"
          size="medium"
          className={currentView === "TableView" ? "active" : undefined}
          onClick={() => {
            setCurrentView("TableView");
          }}
        />
        <ViewToggleIconButton
          mr="xsmall"
          label="Line"
          shape="round"
          outline
          icon="VisLine"
          size="medium"
          className={currentView === "LineChartView" ? "active" : undefined}
          onClick={() => {
            setCurrentView("LineChartView");
          }}
        />
        <ViewToggleIconButton
          icon="Explore"
          shape="round"
          size="medium"
          outline
          label="Explore"
          onClick={openExplore}
        />
      </Flex>
    </Flex>
  );
};

const CohortChoices = styled(Flex)`
  & > * {
    padding-right: ${(props) => props.theme.space.medium};
  }
`;

const ViewToggleIconButton = styled(IconButton)`
  width: 38px;

  &.active,
  &:active {
    background-color: #7b5fac;
    border-color: #7b5fac;
    color: ${(props) => props.theme.colors.palette.white};
  }

  ${Icon} {
    width: 20px;
    height: 20px;
  }
`;

export default CohortPicker;
