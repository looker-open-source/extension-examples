project_name: "vis-filter-integration"

application: vis-filter-integration {
  label: "Visualization and Filter Components (TypeScript)"
  url: "https://localhost:8080/bundle.js"
    entitlements: {
        core_api_methods: ["all_connections", "all_looks", "create_query", "dashboard", "lookml_model_explore", "query_for_slug", "query", "run_inline_query", "run_look", "run_query", "search_folders", "model_fieldname_suggestions"]
    }
}