project_name: "tile-sdk"

application: app {
  label: "Tile SDK Demo"
  # file: "bundle.js"
  url: "https://localhost:8080/bundle.js"
  mount_points: {
      dashboard_vis: yes
      dashboard_tile: yes
      standalone: no
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
