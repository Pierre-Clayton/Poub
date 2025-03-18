import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: "us-east-1",
    userPoolId: "us-east-1_GC1DkkbL5",
    userPoolWebClientId: "4u2unde3sbc2dvtrtkmnl8aaui",
    authenticationFlowType: "USER_SRP_AUTH", // Secure authentication method
    oauth: {
      domain: "us-east-1gc1dkkbl5.auth.us-east-1.amazoncognito.com",
      scope: ["email", "openid", "profile"],
      redirectSignIn: "http://localhost:5173",
      redirectSignOut: "http://localhost:5173",
      responseType: "code"
    }
  }
});
