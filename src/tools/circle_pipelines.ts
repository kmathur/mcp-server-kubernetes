import axios from "axios";

const URL = "https://circleci.com/api/v2/project/gh/kmathur/mcp-server-kubernetes/pipeline ";

const payload = {
  branch: "kartik-bubblehack",
};

type InvokeCirclePipelineInput = {
  branch: string;
  skip_steps?: string[];
};

const headers = {
  "Circle-Token": process.env.CIRCLE_CI_TOKEN ?? "",
  "Content-Type": "application/json"
};
//console.log('CircleCI API Headers:', headers);
export const invokeCirclePipelineSchema = {
  name: "invoke_circle_pipeline",
  description: "Create a new release pipeline for the given branch and optionally skip specific step names",
  inputSchema: {
    type: "object",
    properties: {
      branch: {
        type: "string",
        description: "Branch to trigger the pipeline",
      },
      skip_steps: {
        type: "array",
        items: {
          type: "string",
        },
        description: "List of step names to skip (e.g., ['run_smoke_tests', 'deploy_to_prod'])",
      },
    },
    required: ["branch"],
  },
};


export async function invokeCirclePipeline(
  params: InvokeCirclePipelineInput
): Promise<{ content: { type: string; text: string }[] }> {
  try {
    const payload = {
      branch: params.branch,
      parameters: {
        skip_steps: params.skip_steps?.join(",") || "",
      },
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
 