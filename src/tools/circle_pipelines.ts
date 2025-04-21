import axios from "axios";

const URL = "https://circleci.com/api/v2/project/gh/kmathur/mcp-server-kubernetes/pipeline ";

const payload = {
  branch: "kartik-bubblehack",
};

type InvokeCirclePipelineInput = {
  branch: string;
  [key: `step_${number}`]: boolean;  // This allows any step_N where N is a number
};

const headers = {
  "Circle-Token": process.env.CIRCLE_CI_TOKEN ?? "",
  "Content-Type": "application/json"
};
//console.log('CircleCI API Headers:', headers);
export const invokeCirclePipelineSchema = {
  name: "invoke_circle_pipeline",
  description: "Create a new release pipeline for the given branch and control specific steps",
  inputSchema: {
    type: "object",
    properties: {
      branch: {
        type: "string",
        description: "Branch to trigger the pipeline",
      },
      "step_1": { type: "boolean", description: "Deploy to Edge Environment" },
      "step_2": { type: "boolean", description: "Run Smoke Tests" },
      "step_3": { type: "boolean", description: "Cleanup Test Environment" },
      "step_4": { type: "boolean", description: "Run Python Unit Tests" },
      "step_5": { type: "boolean", description: "Run Playwright Tests" },
      "step_6": { type: "boolean", description: "Validate Edge Upgrade Requirements" },
      "step_7": { type: "boolean", description: "Deploy to Edge" },
      "step_8": { type: "boolean", description: "Deploy to Production" },
      "step_9": { type: "boolean", description: "Run Performance Tests" },
      "step_10": { type: "boolean", description: "Update Customer Environments" },
      "step_11": { type: "boolean", description: "Prepare On-Prem Artifacts" },
    },
    //required: ["branch"],
  },
};


export async function invokeCirclePipeline(
  params: InvokeCirclePipelineInput
): Promise<{ content: { type: string; text: string }[] }> {
  try {
    const { branch, ...steps } = params;
    const payload = {
      branch,
      parameters: steps
    };

    console.log("Triggering CircleCI pipeline with:", JSON.stringify(payload, null, 2));
    const response = await axios.post(URL, payload, { headers });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              status: "success",
              message: "Successfully triggered CircleCI pipeline",
              data: response.data,
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error: any) {
    const message = error.response?.data
      ? JSON.stringify(error.response.data, null, 2)
      : error.message;
      
    throw new Error(`Failed to trigger CircleCI pipeline: ${message}`);
  }
}
 