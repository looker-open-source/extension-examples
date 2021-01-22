/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React from "react";
import { LookList } from "./LookList";
import { QueryContainer } from "./QueryContainer";
import { MessageBar, Box, Heading, Flex } from "@looker/components";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { ILook } from "@looker/sdk";
import {
  Switch,
  Route,
  RouteComponentProps,
  withRouter,
  MemoryRouter,
} from "react-router-dom";
import { hot } from "react-hot-loader/root";

interface ExtensionState {
  looks?: ILook[];
  currentLook?: ILook;
  selectedLookId?: number;
  queryResult?: any;
  runningQuery: boolean;
  loadingLooks: boolean;
  errorMessage?: string;
}

class ExtensionInternal extends React.Component<
  RouteComponentProps,
  ExtensionState
> {
  static contextType = ExtensionContext;
  context!: React.ContextType<typeof ExtensionContext>;

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      looks: undefined,
      selectedLookId: undefined,
      currentLook: undefined,
      queryResult: undefined,
      runningQuery: false,
      loadingLooks: false,
    };
  }

  componentDidMount() {
    const { initializeError } = this.context;
    if (initializeError) {
      return;
    }
    this.loadLooks();
  }

  componentDidUpdate() {
    const { initializeError } = this.context;
    if (initializeError) {
      return;
    }
    // Changes to the browser history drives the running of looks.
    // The look id is part of the URL. Any change to the URL causes
    // componentDidUpdate to run.
    // The look id is extracted from the URL. If it is not present
    // or is not a valid number, the look id of the first loaded
    // looks is updated in the URL. This is a replace rather than a
    // push to reduce the number of actions that do nothing when the
    // browser back button is pressed. Adding the look id to the URL
    // causes componentDidUpdate to run again. When it runs again
    // the look is present and valid. At that point the look is run.
    const { looks, runningQuery, selectedLookId } = this.state;
    if (looks && looks.length > 0 && !runningQuery) {
      const { location } = this.props;
      const path: string[] = location.pathname.split("/");
      let id: number | undefined;
      if (path.length > 1 && path[1] !== "") {
        id = parseInt(path[1], 10);
      }
      if (!id || isNaN(id)) {
        this.props.history.replace("/" + looks[0].id);
      } else {
        if (id !== selectedLookId) {
          this.setState({ selectedLookId: id });
          this.runLook(id);
        }
      }
    }
  }

  /*
  // TEMPLATE CODE FOR RUNNING ANY QUERY
  async runQuery() {
      try {
      const result = await this.context.core40SDK.ok(
        this.context.core40SDK.run_inline_query({
          result_format: "json_detail",
          limit: 10,
          body: {
            total: true,
            model: "thelook",
            view: "users",
            fields: ["last_name", "gender"],
            sorts: [`last_name desc`]
          }
        })
      )
      this.setState({
        queryResult: JSON.stringify(result, undefined, 2),
        runningQuery: false
      })
    } catch (error) {
      this.setState({
        queryResult: "",
        runningQuery: false,
        errorMessage: "Unable to run query"
      })
    }
  }
  */

  async runLook(look_id: number) {
    const look = (this.state.looks || []).find((l) => l.id == look_id);
    // If no matching Look then return
    if (look === undefined) {
      this.setState({
        selectedLookId: undefined,
        currentLook: undefined,
        errorMessage: "Unable to load Look.",
        queryResult: "",
        runningQuery: false,
      });
      return;
    }

    // Set Page title
    this.context.extensionSDK.updateTitle(`Look: ${look.title || "unknown"}`);

    this.setState({
      currentLook: look,
      runningQuery: true,
      errorMessage: undefined,
    });

    try {
      const result = await this.context.core40SDK.ok(
        this.context.core40SDK.run_look({
          look_id: look_id,
          result_format: "json",
        })
      );
      this.setState({
        queryResult: result,
        runningQuery: false,
      });
    } catch (error) {
      this.setState({
        queryResult: "",
        runningQuery: false,
        errorMessage: "Unable to run look",
      });
    }
  }

  async loadLooks() {
    this.setState({ loadingLooks: true, errorMessage: undefined });
    try {
      const result = await this.context.core40SDK.ok(
        this.context.core40SDK.all_looks()
      );
      this.setState({
        // Take up to the first 10 looks
        looks: result.slice(0, 9),
        loadingLooks: false,
      });
    } catch (error) {
      this.setState({
        looks: [],
        loadingLooks: false,
        errorMessage: "Error loading looks",
      });
    }
  }

  onLookSelected(look: ILook) {
    const { currentLook } = this.state;
    if (!currentLook || currentLook.id !== look.id) {
      // Update the look id in the URL. This will trigger componentWillUpdate
      // which will run the look.
      this.props.history.push("/" + look.id);
    }
  }

  render() {
    if (this.context.initializeError) {
      return (
        <MessageBar intent="critical">
          {this.context.initializeError}
        </MessageBar>
      );
    }
    return (
      <>
        {this.state.errorMessage && (
          <MessageBar intent="critical">{this.state.errorMessage}</MessageBar>
        )}
        <Box m="large">
          <Heading fontWeight="semiBold">
            Welcome to the Looker Extension Template
          </Heading>
          <Flex width="100%">
            <LookList
              loading={this.state.loadingLooks}
              looks={this.state.looks || []}
              selectLook={(look: ILook) => this.onLookSelected(look)}
            />
            <Switch>
              <Route path="/:id">
                <QueryContainer
                  look={this.state.currentLook}
                  results={this.state.queryResult}
                  running={this.state.runningQuery}
                />
              </Route>
            </Switch>
          </Flex>
        </Box>
      </>
    );
  }
}

export const Extension = hot(withRouter(ExtensionInternal));
