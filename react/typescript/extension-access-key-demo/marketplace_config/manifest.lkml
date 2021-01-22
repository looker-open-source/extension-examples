project_name: "extension-accesskey-demo"

constant: CONNECTION_NAME {
  value: "connection"
  export: override_required
}

application: extension-accesskey-demo {
  label: "Extension Access Key Demo"
  file: "bundle.js"
  entitlements: {
    allow_same_origin: yes
    allow_forms: yes
    core_api_methods: ["me", "all_user_attributes", "delete_user_attribute", "create_user_attribute"]
    external_api_urls: ["http://127.0.0.1:3000"]
    scoped_user_attributes: [
      "show_configuration_editor",
      "access_key",
    ]
  }
}
