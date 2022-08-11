project_name: "looks-query"

application: look-runner {
    label: "Look Runner"
    url: "https://localhost:8080/bundle.js"
    # file: "bundle.js
    entitlements: {
      core_api_methods: ["run_inline_query", "me", "all_looks", "run_look"]
    }
  }