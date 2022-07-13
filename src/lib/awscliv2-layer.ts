import { spawnSync } from "child_process";
import { join } from "path";
import { AssetHashType, DockerImage } from "aws-cdk-lib";
import { Code, LayerVersion } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

/**
 * An AWS Lambda layer that includes the AWS CLI v2.
 */
export class AwsCliV2Layer extends LayerVersion {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      code: Code.fromAsset("./", {
        assetHashType: AssetHashType.OUTPUT,
        bundling: {
          image: DockerImage.fromRegistry("amazon/aws-cli"),
          entrypoint: ["bash", "-c"], // 現在は不具合で利用できない
          command: [
            "cp -rf /usr/local/aws-cli/v2/current/dist /asset-output/bin",
          ],
          local: {
            tryBundle(outputDir) {
              const bin = join(outputDir, "bin");
              spawnSync("mkdir", [bin]);
              spawnSync(
                "cp",
                ["-rf", "/usr/local/aws-cli/v2/current/dist/*", bin],
                {
                  shell: true,
                }
              );
              return true;
            },
          },
        },
      }),
      description: "/opt/bin/aws",
    });
  }
}
