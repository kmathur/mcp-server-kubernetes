import axios from "axios";

//const LIGHTHOUSE_API_URL = process.env.LIGHTHOUSE_API_URL || "<lighthouse_api_url>";
//const URL = `http://${LIGHTHOUSE_API_URL}/instances`;

const URL_BASE = "http://lighthouse-api.g498.io";
const payload = {
  requester: "<your_email>",
  version: "25.3.1",
  size: "0.25x_Standard",
  gpu: false,
  intention_type: "Internal",
  expiration_date: "2025-04-20"
};


const headers = {
  Authorization: "key <token>"
};

export const createLightHouseInstanceSchema = {
    name: "create_lighthouse_instance",
    description: "Create a new demo instance on Lighthouse",
    inputSchema: {
      type: "object",
      properties: {
        requester: {
          type: "string",
          description: "Email of the person requesting the instance",
        },
        version: {
          type: "string",
          description: "Version of the instance to create",
        },
        size: {
          type: "string",
          description: "Size of the instance (e.g., '0.25x_Standard')",
        },
        gpu: {
          type: "boolean",
          description: "Whether GPU is required",
        },
        intention_type: {
          type: "string",
          description: "Purpose of the instance (e.g., 'Internal')",
        },
        expiration_date: {
          type: "string",
          description: "Expiration date in YYYY-MM-DD format",
        },
      },
      required: ["requester", "version", "size", "intention_type", "expiration_date"],
    },
  };

  export const getLightHouseDemoInstanceSchema = {
    name: "get_lighthouse_demo_instance",
    description: "Get all demo instances from Lighthouse",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Owner of the instance",
        },
      },
      //required: ["owner"],
    },
  };

  export async function getLightHouseDemoInstance(params: { owner: string }): Promise<{ content: { type: string; text: string }[] }> {
    try {
      //const LIGHTHOUSE_API_URL = process.env.LIGHTHOUSE_API_URL || "<lighthouse_api_url>";
      const URL = `${URL_BASE}/instances/view`;
      const response = await axios.get(`${URL}?owner=${params.owner}`, { headers });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "success",
              message: "Successfully retrieved instances",
              data: response.data
            }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get instances: ${error.response?.data || error.message}`);
    }
  }
  
  
  export async function createLightHouseInstance(params: typeof payload): Promise<{ content: { type: string; text: string }[] }> {
    try {
      const URL = `${URL_BASE}/instances`;
      const response = await axios.post(URL, params, { headers });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "created",
              message: "Successfully created instance",
              data: response.data
            }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to create instance: ${error.response?.data || error.message}`);
    }
  }