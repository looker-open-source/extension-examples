project_name: "access_key_demo"
application: access_key_demo {
  label: "Extension Access Key Demo"
  url: "https://localhost:8080/bundle.js"
  #file: "bundle.js"
  entitlements: {
    use_form_submit: yes
    core_api_methods: ["me", "all_user_attributes", "delete_user_attribute", "create_user_attribute"]
    external_api_urls: ["http://127.0.0.1:3000", "http://localhost:3000"]
  }
}
