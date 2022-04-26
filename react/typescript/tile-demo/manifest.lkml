project_name: "tile-demo"

application: vis {
  label: "Visualization Demo"
  # file: "bundle.js"
  url: "https://localhost:8080/bundle.js"
  mount_points: {
      dashboard_vis: yes
  }
  entitlements: {
      local_storage: yes
      use_form_submit: yes
      core_api_methods: []
      external_api_urls: []
      oauth2_urls: []
      scoped_user_attributes: []
      global_user_attributes: []
  }
}

application: tile {
  label: "Tile Demo"
  # file: "bundle.js"
  url: "https://localhost:8080/bundle.js"
  mount_points: {
      dashboard_tile: yes
  }
  entitlements: {
      local_storage: yes
      use_form_submit: yes
      core_api_methods: ["run_inline_query"]
      external_api_urls: []
      oauth2_urls: []
      scoped_user_attributes: []
      global_user_attributes: []
  }
}
