// lib/utils/fetch.util.ts
import axios, { AxiosRequestConfig } from "axios";
import { ResponseDTO as ResponseDto } from "../constants/response.constant";
import { RESPONSE } from "./response.util";

export const GET: Function = async (
  url: string,
  params: string,
  token: string
): Promise<ResponseDto> => {
  try {
    let response: AxiosRequestConfig = await axios({
      method: "get",
      url: `${url}${params}`,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    let data: Awaited<ResponseDto> = await response.data;
    return RESPONSE(data.status, data, data.message);
  } catch (error: any) {
    console.log(error);
    return RESPONSE(400, error, "Bad Request");
  }
};

export const POST: Function = async (
  url: string,
  params: string,
  body: object,
  token: string
): Promise<ResponseDto> => {
  try {
    let response: AxiosRequestConfig = await axios({
      method: "post",
      url: `${url}${params}`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    let data: Awaited<ResponseDto> = await response.data;
    return RESPONSE(data.status, data, data.message);
  } catch (error: any) {
    console.log(error);
    return RESPONSE(400, error, "Bad Request");
  }
};

export const PUT: Function = async (
  url: string,
  params: string,
  body: object,
  token: string
): Promise<ResponseDto> => {
  try {
    let response: AxiosRequestConfig = await axios({
      method: "put",
      url: `${url}${params}`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    let data: Awaited<ResponseDto> = await response.data;
    return RESPONSE(data.status, data, data.message);
  } catch (error: any) {
    console.log(error);
    return RESPONSE(400, error, "Bad Request");
  }
};

export const DELETE: Function = async (
  url: string,
  params: string,
  body: object,
  token: string
): Promise<ResponseDto> => {
  try {
    let response: AxiosRequestConfig = await axios({
      method: "delete",
      url: `${url}${params}`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    let data: Awaited<ResponseDto> = await response.data;
    return RESPONSE(data.status, data, data.message);
  } catch (error: any) {
    console.log(error);
    return RESPONSE(400, error, "Bad Request");
  }
};
