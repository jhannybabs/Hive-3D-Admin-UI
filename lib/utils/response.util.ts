import { ResponseDTO } from "../constants/response.constant";

export const RESPONSE: Function = (
  status: number = 0,
  response: object = {},
  message: string = ""
): ResponseDTO => {
  return {
    status: status,
    response: response,
    message: message,
  };
};
