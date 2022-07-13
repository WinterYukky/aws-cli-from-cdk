import { join } from "path";
import {
  App,
  Stack,
  StackProps,
  aws_lambda as lambda,
  Duration,
} from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { AwsCliV2Layer } from "./lib/awscliv2-layer";

export class AwsCliFromCdkStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const func = new lambda.Function(this, "ExampleFunc", {
      runtime: Runtime.PROVIDED_AL2,
      timeout: Duration.minutes(1),
      handler: "function.handler",
      code: Code.fromAsset(join(__dirname, "handler")),
      initialPolicy: [
        new PolicyStatement({
          actions: ["s3:ListAllMyBuckets", "s3:ListBucket"],
          resources: ["*"],
          effect: Effect.ALLOW,
        }),
      ],
    });

    const bootstrap = new lambda.LayerVersion(this, "Bootstrap", {
      code: Code.fromAsset(join(__dirname, "runtime")),
    });

    func.addLayers(bootstrap, new AwsCliV2Layer(this, "AwsCliV2"));
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new AwsCliFromCdkStack(app, "AwsCliFromCdkStack", { env: devEnv });
// new AwsCliFromCdkStack(app, 'aws-cli-from-cdk-prod', { env: prodEnv });

app.synth();
