# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  tabs: [
    {
      title: "Purchases"
      id: "index"
      location: "example#getting-started" # Supersonic module#view type navigation
    }
    {
      title: "Summary"
      id: "settings"
      location: "example#settings"
    }
    {
      title: "Profile"
      id: "profile"
      location: "example#profile"
    }
  ]

  # rootView:
  #   location: "example#getting-started"

  preloads: [
    {
      id: "index"
      location: "example#getting-started"
    }
    {
      id: "settings"
      location: "example#settings"
    }
    {
        id: "add-purchase"
        location: "example#purchase"
    }
  ]

  # drawers:
  #   left:
  #     id: "leftDrawer"
  #     location: "example#drawer"
  #     showOnAppLoad: false
  #   options:
  #     animation: "swingingDoor"
  #
  initialView:
     id: "initialView"
     location: "example#login"
