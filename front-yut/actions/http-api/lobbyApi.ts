import { EnterRoomRejcetStatusType } from "@/types/http-api/lobbyApiTypes";
import { getAsync, postAsync } from "./axiosInstance";

const createRoom = async () => {
  const response = await getAsync("/api/room/made");
  return response;
};

const enterRoom = async (roomCode: string) => {
  const response = await postAsync("/api/room/entry", { roomCode: roomCode });

  if (!response.isSuccess) {
    const { status }: EnterRoomRejcetStatusType =
      response.result?.response?.data;

    return { isSuccess: false, result: status };
  }
  return response;
};

export { createRoom, enterRoom };
