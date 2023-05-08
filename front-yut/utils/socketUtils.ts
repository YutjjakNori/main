import { stompClient } from "@/actions/socket-api/socketInstance";

//map형태로 만들고 value를 큐를 사용해서 넘기기
let obj: any = {}; // obj 객체를 subscribeEvent 함수 외부에 정의합니다.

const stringify = (message: any): any => {
  return JSON.stringify(message);
};

const parse = (message: string): any => {
  return JSON.parse(message);
};

const subscribeEvent = (eventName: string, callback?: any) => {
  stompClient?.subscribe(eventName, (body: any) => {
    obj = parse(body.body);
    if (callback) callback(obj);
    //return 여기서하기? body안에 데이터가 없으면 리턴하던말던 담아주지 않기
  });
};

const sendEventTest = (
  eventName: string,
  header: any,
  contents: any,
  callback?: any
) => {
  stompClient?.send(eventName, header, stringify(contents));
  if (callback) callback();
};

export { stringify, parse, subscribeEvent, sendEventTest, obj };
