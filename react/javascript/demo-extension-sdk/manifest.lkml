project_name: "demo-extension-sdk"
application: demo-extension-sdk {
  label: "Demo Extension SDK"
  # use url for development
  url: "https://localhost:8080/bundle.js"
  # use file for production deployment
  # file: "bundle.js"
  entitlements: {
    local_storage: yes
    navigation: yes
    new_window: yes
    new_window_external_urls: ["https://docs.looker.com/*","https://github.com/*"]
    use_form_submit: yes
    use_embeds: no
    use_downloads: no
    use_iframes: no
    use_clipboard: yes
    core_api_methods: [""]
    external_api_urls: []
    oauth2_urls: []
    scoped_user_attributes: ["user_value"]
    global_user_attributes: ["locale"]
  }
}
