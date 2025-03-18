// mvp/frontend/src/awsAmplify.js

import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: "us-east-1",             // ex: "eu-west-1"
    userPoolId: "us-east-1_GC1DkkbL5",
    userPoolWebClientId: "4u2unde3sbc2dvtrtkmnl8aaui",
    authenticationFlowType: "USER_PASSWORD_AUTH"
  }
});

export default Amplify;
