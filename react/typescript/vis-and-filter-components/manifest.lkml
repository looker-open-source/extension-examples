project_name: "helloworld-ts"

application: helloworld-ts {
  label: "Helloworld (TypeScript)"
  url: "http://localhost:8080/bundle.js"
  # file: "bundle.js
  entitlements: {
  core_api_methods: ["me"]
}
}