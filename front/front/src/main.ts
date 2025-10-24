import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    userPoolId: 'eu-central-1_4yvgRzhnF',
    userPoolWebClientId: '7425ha9oivce0vc386n284rm0p',
    region: 'eu-central-1',
    loginWith: {
      username: true,
      email: false,
    },
    mandatorySignIn: false,
  },
});

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
  .catch((err) => console.error(err));
