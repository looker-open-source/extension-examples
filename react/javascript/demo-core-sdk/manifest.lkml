project_name: "demo-core-sdk"
application: demo-core-sdk {
  label: "Demo Core SDK"
  # use url for development
  url: "https://localhost:8080/bundle.js"
  # use file for production deployment
  # file: "bundle.js"
  entitlements: {
    local_storage: no
    navigation: no
    new_window: yes
    new_window_external_urls: ["https://github.com/*"]
    use_form_submit: yes
    use_embeds: no
    use_downloads: no
    use_iframes: no
    use_clipboard: yes
    core_api_methods: ["all_dashboards", "all_looks", "run_look"]
    external_api_urls: []
    oauth2_urls: []
    scoped_user_attributes: []
    global_user_attributes: []
  }
}
