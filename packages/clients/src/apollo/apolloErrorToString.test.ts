import { ApolloError } from 'apollo-client';
import { apolloErrorToString } from './apolloErrorToString';
// Real serialized apollo error captured through browser console
// tslint:disable:max-line-length
const errorExample = {
  graphQLErrors: [],
  networkError: {
    response: {},
    statusCode: 400,
    result: {
      errors: [
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field value.river.region of required type RefInput! was not provided.',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "altNames" is not defined by type SectionRiverInput at value.river; did you mean name?',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "language" is not defined by type RefInput at value.gauge.',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "levelUnit" is not defined by type RefInput at value.gauge.',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "flowUnit" is not defined by type RefInput at value.gauge.',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "location" is not defined by type RefInput at value.gauge.',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "lastTimestamp" is not defined by type RefInput at value.gauge.',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "lastLevel" is not defined by type RefInput at value.gauge.',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "lastFlow" is not defined by type RefInput at value.gauge.',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "__typename" is not defined by type RefInput at value.gauge.',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "__typename" is not defined by type GaugeBindingInput at value.levels.',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.070Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "__typename" is not defined by type GaugeBindingInput at value.flows.',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.071Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "language" is not defined by type RefInput at value.tags[0].',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.071Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "category" is not defined by type RefInput at value.tags[0].',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.071Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "__typename" is not defined by type RefInput at value.tags[0].',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.071Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "language" is not defined by type RefInput at value.tags[1].',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.071Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "category" is not defined by type RefInput at value.tags[1].',
            originalError: 'GraphQLError',
          },
        },
        {
          message: 'An unknown error has occurred!  Please try again later',
          name: 'UnknownError',
          time_thrown: '2018-02-17T09:03:50.071Z',
          data: {
            originalMessage:
              'Variable "$section" got invalid value {"id":"2b01742c-d443-11e7-9296-cec278b6b50a","name":"Gal_riv_1_sec_1","altNames":[],"river":{"id":"a8416664-bfe3-11e7-abc4-cec278b6b50a","name":"Gal_Riv_One","altNames":[]},"season":"Gal_riv_1_sec_1 season","seasonNumeric":[0,1,2,3,4],"distance":11.1,"drop":12.2,"duration":20,"difficulty":3.5,"difficultyXtra":"X","rating":4.5,"description":"Gal\\\\_riv\\\\_1\\\\_sec\\\\_1 description","shape":[[10,10,0],[20,20,0]],"gauge":{"id":"aba8c106-aaa0-11e7-abc4-cec278b6b50a","language":"en","name":"Galicia gauge 1","levelUnit":"cm","flowUnit":"m3/s","location":{"id":"0c86ff2c-bbdd-11e7-abc4-cec278b6b50a","kind":"gauge","coordinates":[1.1,2.2,3.3],"__typename":"Point"},"lastTimestamp":null,"lastLevel":null,"lastFlow":null,"__typename":"Gauge"},"levels":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flows":{"minimum":10,"maximum":30,"optimum":20,"impossible":40,"approximate":false,"__typename":"GaugeBinding"},"flowsText":"Gal_riv_1_sec_1 flows text","pois":[{"id":"ca0bee06-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Rapid","description":"Some rapid","coordinates":[1.2,3.2,4.3],"kind":"rapid"},{"id":"ef6f80ea-d445-11e7-9296-cec278b6b50a","name":"Galicia Riv 1 Sec 1 Portage","description":"Some portage","coordinates":[5,6,7],"kind":"portage"}],"tags":[{"id":"waterfalls","language":"en","name":"Waterfalls","category":"kayaking","__typename":"Tag"},{"id":"undercuts","language":"en","name":"Undercuts","category":"hazards","__typename":"Tag"}]}; Field "__typename" is not defined by type RefInput at value.tags[1].',
            originalError: 'GraphQLError',
          },
        },
      ],
    },
  },
  message: 'Network error: Response not successful: Received status code 400',
};

const testError = new ApolloError({
  graphQLErrors: errorExample.graphQLErrors,
  errorMessage: errorExample.message,
  networkError: Object.assign(new Error(), errorExample.networkError),
});

it('should print message as first line', () => {
  expect(
    apolloErrorToString(testError).indexOf(`${errorExample.message}\n`),
  ).toBe(0);
});

it('should contain whole stringified error after message', () => {
  expect(apolloErrorToString(testError)).toContain(
    `\n\n${JSON.stringify(testError, null, 2)}`,
  );
});
