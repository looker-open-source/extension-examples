project_name: "fileupload"

application: fileupload {
  label: "File upload demo"
  url: "http://localhost:8080/bundle.js"
  entitlements: {
    external_api_urls: ["http://localhost:3000"]
  }
}
