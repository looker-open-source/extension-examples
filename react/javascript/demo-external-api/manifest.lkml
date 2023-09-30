project_name: "demo-external-api"

application: demo-external-api {
  label: "Demo External API"
  # use url for development
  url: "https://localhost:8080/bundle.js"
  # use file for production deployment
  # file: "bundle.js"
  entitlements: {
    local_storage: no
    navigation: no
    new_window: no
    new_window_external_urls: []
    use_form_submit: yes
    use_embeds: no
    use_downloads: no
    use_iframes: no
    use_clipboard: no
    core_api_methods: []
    external_api_urls: ["https://*.googleapis.com"]
    oauth2_urls: ["https://accounts.google.com/o/oauth2/v2/auth"]
    scoped_user_attributes: []
    global_user_attributes: []
  }
}
