import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_Z5AwbkW3r',
      userPoolClientId: '5s262fjf6invnu51bqkpjkm5qs',
      region: 'eu-central-1',
      loginWith: {
        username: true,
        email: false
      },
      mandatorySignIn: false,
    } as any
  }
}, { ssr: false });

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
