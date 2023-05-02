import { CompatClient } from "@stomp/stompjs";

const stringify = (message: string): any => {
  return JSON.stringify(message);
};

const parse = (message: string): any => {
  return JSON.parse(message);
};

const subscribeEvnet = (
  socketInstance: CompatClient | null,
  eventName: string,
  callback: any
) => {
  socketInstance?.subscribe(eventName, (body: any) => {
    const obj = parse(body.body);
    callback(obj);
  });
};

export { stringify, parse, subscribeEvnet };
