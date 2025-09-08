const isProd = process.env.NODE_ENV === "production";

const config = {
  apiBaseUrl:
    "http://spacex-app-alb-1144963660.us-east-1.elb.amazonaws.com/api/v1",
};

export default config;
