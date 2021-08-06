project_name: "uberext"

application: demo-core-sdk {
  file: "dist/./bundle.js"
  label: "Demo Core SDK (uberext) (uberext)"
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

application: demo-embeds {
  label: "Demo Embeds (uberext) (uberext)"
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

application: demo-extension-sdk {
  label: "Demo Extension SDK (uberext) (uberext)"
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

application: demo-external-api {
  label: "demo-external-api (uberext) (uberext)"
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

application: filedownload {
  label: "File download demo (uberext) (uberext)"
  entitlements: {
    use_downloads: yes
  }
}

application: fileupload {
  label: "File upload demo (uberext) (uberext)"
  entitlements: {
    external_api_urls: ["http://localhost:3000"]
  }
}

application: helloworld-js {
  label: "Helloworld (JavaScript) (uberext) (uberext)"
  entitlements: {
    core_api_methods: ["me"]
  }
}

application: map-iframe {
  label: "Map IFRAME demo (uberext) (uberext)"
  entitlements: {
      use_iframes: yes
  }
}

application: access_key_demo {
  label: "Extension Access Key Demo (uberext) (uberext)"
  entitlements: {
    use_form_submit: yes
    core_api_methods: ["me", "all_user_attributes", "delete_user_attribute", "create_user_attribute"]
    external_api_urls: ["http://127.0.0.1:3000", "http://localhost:3000"]
  }
}

application: helloworld-ts {
  label: "Helloworld (TypeScript) (uberext) (uberext)"
  entitlements: {
  core_api_methods: ["me"]
}
}
application: kitchensink {
  label: "Kitchen sink (uberext) (uberext)"
  entitlements: {
    local_storage: yes
    navigation: yes
    new_window: yes
    use_form_submit: yes
    use_embeds: yes
    core_api_methods: ["all_connections","search_folders", "run_inline_query", "me", "all_looks", "run_look"]
    external_api_urls: ["http://127.0.0.1:3000", "http://localhost:3000", "https://*.googleapis.com", "https://*.github.com", "https://REPLACE_ME.auth0.com"]
    oauth2_urls: ["https://accounts.google.com/o/oauth2/v2/auth", "https://github.com/login/oauth/authorize", "https://dev-5eqts7im.auth0.com/authorize", "https://dev-5eqts7im.auth0.com/login/oauth/token", "https://github.com/login/oauth/access_token"]
    scoped_user_attributes: ["user_value"]
    global_user_attributes: ["locale"]
  }
}

application: look-runner {
    label: "Look Runner (uberext) (uberext)"
    entitlements: {
      core_api_methods: ["run_inline_query", "me", "all_looks", "run_look"]
    }
  }
application: look-runner-redux {
    label: "Look Runner (uberext) (uberext)"
    entitlements: {
      core_api_methods: ["run_inline_query", "me", "all_looks", "run_look"]
    }
  }
application: extension-counter {
  label: "Extension Counter (uberext) (uberext)"
  entitlements: {
    core_api_methods: ["me"]
  }
}

application: extension-counter-ts {
  label: "Extension Counter (uberext) (uberext)"
  entitlements: {
    core_api_methods: ["me"]
  }
}

application: demo-core-sdk {
  file: "dist/demo-core-sdk/bundle.js"
  label: "Demo Core SDK (uberext)"
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

application: demo-embeds {
  file: "dist/demo-embeds/bundle.js"
  label: "Demo Embeds (uberext)"
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

application: demo-extension-sdk {
  file: "dist/demo-extension-sdk/bundle.js"
  label: "Demo Extension SDK (uberext)"
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

application: demo-external-api {
  file: "dist/demo-external-api/bundle.js"
  label: "demo-external-api (uberext)"
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

application: filedownload {
  file: "dist/file-download/bundle.js"
  label: "File download demo (uberext)"
  entitlements: {
    use_downloads: yes
  }
}

application: fileupload {
  file: "dist/file-upload/bundle.js"
  label: "File upload demo (uberext)"
  entitlements: {
    external_api_urls: ["http://localhost:3000"]
  }
}

application: helloworld-js {
  file: "dist/helloworld-js/bundle.js"
  label: "Helloworld (JavaScript) (uberext)"
  entitlements: {
    core_api_methods: ["me"]
  }
}

application: map-iframe {
  file: "dist/map-iframe/bundle.js"
  label: "Map IFRAME demo (uberext)"
  entitlements: {
      use_iframes: yes
  }
}

application: access_key_demo {
  file: "dist/access-key-demo/bundle.js"
  label: "Extension Access Key Demo (uberext)"
  entitlements: {
    use_form_submit: yes
    core_api_methods: ["me", "all_user_attributes", "delete_user_attribute", "create_user_attribute"]
    external_api_urls: ["http://127.0.0.1:3000", "http://localhost:3000"]
  }
}

application: helloworld-ts {
  file: "dist/helloworld-ts/bundle.js"
  label: "Helloworld (TypeScript) (uberext)"
  entitlements: {
  core_api_methods: ["me"]
}
}
application: kitchensink {
  file: "dist/kitchensink/bundle.js"
  label: "Kitchen sink (uberext)"
  entitlements: {
    local_storage: yes
    navigation: yes
    new_window: yes
    use_form_submit: yes
    use_embeds: yes
    core_api_methods: ["all_connections","search_folders", "run_inline_query", "me", "all_looks", "run_look"]
    external_api_urls: ["http://127.0.0.1:3000", "http://localhost:3000", "https://*.googleapis.com", "https://*.github.com", "https://REPLACE_ME.auth0.com"]
    oauth2_urls: ["https://accounts.google.com/o/oauth2/v2/auth", "https://github.com/login/oauth/authorize", "https://dev-5eqts7im.auth0.com/authorize", "https://dev-5eqts7im.auth0.com/login/oauth/token", "https://github.com/login/oauth/access_token"]
    scoped_user_attributes: ["user_value"]
    global_user_attributes: ["locale"]
  }
}

application: look-runner {
  file: "dist/looks-query/bundle.js"
    label: "Look Runner (uberext)"
    entitlements: {
      core_api_methods: ["run_inline_query", "me", "all_looks", "run_look"]
    }
  }
application: look-runner-redux {
  file: "dist/looks-query-redux/bundle.js"
    label: "Look Runner (uberext)"
    entitlements: {
      core_api_methods: ["run_inline_query", "me", "all_looks", "run_look"]
    }
  }
application: extension-counter {
  file: "dist/counter/bundle.js"
  label: "Extension Counter (uberext)"
  entitlements: {
    core_api_methods: ["me"]
  }
}

application: extension-counter-ts {
  file: "dist/counter-ts/bundle.js"
  label: "Extension Counter (uberext)"
  entitlements: {
    core_api_methods: ["me"]
  }
}
