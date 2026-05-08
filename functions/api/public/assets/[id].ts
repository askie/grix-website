import { jsonResponse } from "../../../shared/http/json";

export async function onRequestGet(context: any): Promise<Response> {
  return jsonResponse({
    id: context.params.id,
    message: "Asset lookup placeholder. Implement R2 signed or public delivery policy here."
  });
}
