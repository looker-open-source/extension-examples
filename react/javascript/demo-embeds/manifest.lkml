project_name: "demo-embeds"

application: demo-embeds {
  label: "Demo Embeds"
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
    use_embeds: yes
    use_downloads: no
    use_iframes: no
    use_clipboard: no
    core_api_methods: ["all_lookml_models", "all_dashboards", "all_looks"]
    external_api_urls: []
    oauth2_urls: []
    scoped_user_attributes: []
    global_user_attributes: []
  }
}
