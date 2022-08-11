project_name: "extension-counter-ts"

application: extension-counter-ts {
  label: "Extension Counter"
  url: "https://localhost:8081/bundle.js"
  # file: "bundle.js"
  entitlements: {
    core_api_methods: ["me"]
  }
}
