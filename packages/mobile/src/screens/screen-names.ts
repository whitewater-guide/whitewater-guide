const Screens = {
  RegionsList: 'RegionsList',
  Region: {
    Root: 'Region',
    Tabs: {
      Root: 'RegionTabs',
      Map: 'RegionMap',
      SectionsList: 'RegionSectionsList',
      Info: 'RegionInfo',
    },
    AddSection: {
      Root: 'AddSectionStack',
      Tabs: {
        Root: 'AddSectionTabs',
        Main: 'AddSectionMain',
        Attributes: 'AddSectionAttributes',
        Description: 'AddSectionDescription',
        Flows: 'AddSectionFlows',
      },
      River: 'AddSectionRiver',
      Gauge: 'AddSectionGauge',
      Shape: 'AddSectionShape',
    },
  },
  Section: {
    Root: 'Section',
    Map: 'SectionMap',
    Chart: 'SectionChart',
    Info: 'SectionInfo',
    Guide: 'SectionGuide',
    Media: 'SectionMedia',
  },
  MyProfile: 'MyProfile',
  Filter: 'Filter',
  Auth: {
    Root: 'Auth',
    Main: 'AuthMain',
    SignIn: 'AuthSignIn',
    Register: 'AuthRegister',
    Forgot: 'AuthForgot',
    Reset: 'AuthReset',
    Welcome: 'AuthWelcome',
  },
  Purchase: {
    Root: 'Purchase',
    Buy: 'Buy',
    AlreadyHave: 'AlreadyHave',
    Verify: 'Verify',
    Success: 'Success',
  },
  Plain: 'Plain',
  WebView: 'WebView',
  Suggestion: 'Suggestion',
};

export default Screens;
