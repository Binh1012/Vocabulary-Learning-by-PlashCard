/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/type`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/navigation/AppNavigator`; params?: Router.UnknownInputParams; } | { pathname: `/screens/LoginScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screens/SignUpScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screens/StartScreen`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/type`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/navigation/AppNavigator`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/LoginScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/SignUpScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/StartScreen`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/type${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/navigation/AppNavigator${`?${string}` | `#${string}` | ''}` | `/screens/LoginScreen${`?${string}` | `#${string}` | ''}` | `/screens/SignUpScreen${`?${string}` | `#${string}` | ''}` | `/screens/StartScreen${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/type`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/navigation/AppNavigator`; params?: Router.UnknownInputParams; } | { pathname: `/screens/LoginScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screens/SignUpScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screens/StartScreen`; params?: Router.UnknownInputParams; };
    }
  }
}
