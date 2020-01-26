// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig:{
    apiKey: "AIzaSyAC-WfbtrYHUo42QOubSf9NdM73rWqOqFo",
    authDomain: "facturacion-cloud.firebaseapp.com",
    databaseURL: "https://facturacion-cloud.firebaseio.com",
    projectId: "facturacion-cloud",
    storageBucket: "gs://facturacion-cloud.appspot.com",
    messagingSenderId: "260949622588"
  },
  api_server:"https://facturacioncloud2019.herokuapp.com"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
