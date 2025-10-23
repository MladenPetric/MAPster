import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
      userPoolId: 'eu-central-1_bM93YJeMx',
      userPoolWebClientId: '4l3h8plbgi0n0k9i4h9pqat1h1',
      region: 'eu-central-1',
      loginWith: {
        username: true,
        email: false
      },
      mandatorySignIn: false,
    }
});

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
