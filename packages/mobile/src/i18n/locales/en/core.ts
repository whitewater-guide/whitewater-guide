import auth from './auth';

export default {
  auth,
  commons: {
    putIn: 'Put-in',
    takeOut: 'Take-out',
    km: 'km',
    m: 'm',
    cm: 'cm',
    'm3/s': 'm³/s',
    length: 'Distance',
    drop: 'Drop',
    unknown: 'unknown',
    season: 'Season',
    flow: 'Flow',
    flows: 'Flows',
    level: 'Level',
    navigate: 'Navigate',
    min: 'min',
    max: 'max',
    opt: 'opt',
    difficulty: 'Difficulty',
    rating: 'Rating',
    duration: 'Duration',
    kayakingTypes: 'Kayaking types',
    hazards: 'Hazards',
    supplyTypes: 'River supply',
    miscTags: 'Misc',
    gauge: 'Gauge',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
  },
  drawer: {
    myProfile: 'My Settings',
    facebookLogin: 'Login with Facebook',
    regions: 'Regions',
    faq: 'FAQ',
    termsAndConditions: 'Terms and conditions',
    privacyPolicy: 'Privacy policy',
  },
  myProfile: {
    title: 'My Profile',
    general: 'General',
    language: 'Language',
    logout: 'Log out',
  },
  regionsList: {
    title: 'Regions',
    riversCount: 'Rivers',
    sectionsCount: 'Sections',
  },
  region: {
    info: {
      title: 'About region',
      noData: 'No description for this region',
    },
    map: {
      title: 'Map',
      selectedSection: {
        swipeUpTip: 'Swipe up to see more',
        details: 'Details',
        flows: 'Flows',
      },
    },
    sections: {
      title: 'Sections',
    },
  },
  section: {
    chart: {
      day: 'Day',
      week: 'Week',
      month: 'Month',
      flowToggle: 'Select measurement',
      lastRecorded: {
        title: 'Last recorded',
        flow: 'flow',
        level: 'level',
      },
      lastUpdated: 'Last updated',
      approximateWarning: 'This gauge gives very approximate\ndata for this river!',
      gaugeMenu: {
        title: 'Gauge information',
        aboutSource: 'About the data source',
        webPage: 'Open gauge web page',
      },
      outdatedWarning: 'This data is probably outdated :(',
      noData: 'There is no data for this period',
      noGauge: 'There is no gauge for this section',
    },
    guide: {
      noData: 'No guide for this section yet...',
    },
    media: {
      photos: 'Photos',
      videos: 'Videos',
      noMedia: 'No {{type}} for this section yet :(',
    },
  },
  filter: {
    title: 'Filters',
    reset: 'Reset',
    difficultyValue: 'Difficulty: {{minDiff}}',
    difficultyRange: 'Difficulty: from {{minDiff}} to {{maxDiff}}',
    durationValue: 'Duration: {{minDuration}}',
    durationRange: 'Duration: from {{minDuration}} to {{maxDuration}}',
    rating: 'Minimal rating',
    search: 'Find',
  },
  durations: {
    laps: 'Laps',
    twice: 'Twice a day',
    'day-run': 'Whole day',
    overnighter: 'Overnighter',
    'multi-day': 'Multiday',
  },
  poiTypes: {
    'put-in': 'Put-in',
    'put-in-alt': 'Alternative put-in',
    'put-in-road': 'End of road to put-in',
    'take-out': 'Take-out',
    'take-out-alt': 'Alternative take-out',
    'take-out-road': 'End of road to take-out',
    waterfall: 'Waterfall',
    rapid: 'Rapid',
    portage: 'Portage',
    playspot: 'Playspot',
    hazard: 'Hazard',
    'river-campsite': 'River campsite',
    'wild-camping': 'Wild camping',
    'paid-camping': 'Paid camping',
    gauge: 'Gauge',
    'hike-waypoint': 'Hiking trail waypoint',
    bridge: 'Bridge',
    dam: 'dam',
    'power-plant': 'Power plant (water release)',
    'kayak-shop': 'kayak-shop',
    other: 'Other',
  },
};
