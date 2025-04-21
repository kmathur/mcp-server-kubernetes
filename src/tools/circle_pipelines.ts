import axios from "axios";

const URL = "https://circleci.com/api/v2/project/gh/kmathur/mcp-server-kubernetes/pipeline";

const payload = {
  branch: "kartik-bubblehack",
};

type CircleSteps = {
  step_1?: boolean;
  step_2?: boolean;
  step_3?: boolean;
  step_4?: boolean;
  step_5?: boolean;
  step_6?: boolean;
  step_7?: boolean;
  step_8?: boolean;
  step_9?: boolean;
  step_10?: boolean;
  step_11?: boolean;
};

type InvokeCirclePipelineInput = {
  branch: string;
  parameters?: CircleSteps;
};

const headers = {
  "Content-Type": "application/json"
};

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
      parameters: {
        type: "object",
        properties: {
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
        }
      }
    },
    //required: ["branch"],
  },
};


export async function invokeCirclePipeline(
  params: InvokeCirclePipelineInput
): Promise<{ content: { type: string; text: string }[] }> {
  if (!process.env.CIRCLE_CI_TOKEN) {
    throw new Error('CircleCI API token not configured');
  }
  
  try {
    const { branch, ...steps } = params;
    const payload = {
      branch,
      parameters: {
        ...steps.parameters  // Fix: Access the parameters property instead of spreading steps directly
      }
    };

    //console.log("Triggering CircleCI pipeline with:", JSON.stringify(payload, null, 2));
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
 