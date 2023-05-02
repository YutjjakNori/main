import { StaticImageData } from "next/image";

type PieceStateType = "NotStarted" | "InBoard" | "Done" | "Appended";

/** 현재 실행중인 게임 로직 종류
 * @Started 게임 시작
 * @ThrowYut 윷을 던져야함
 * @ChoosePiece 윷 말을 고름
 * @MovePiece 윷 말을 움직임
 * @End 게임 끝
 * */
type GameActionType =
  | "Started"
  | "ThrowYut"
  | "ChoosePiece"
  | "MovePiece"
  | "End";

/** 윷 판 모서리 타입
 * @leftTop 왼쪽 위 분기점
 * @rightTop 오른쪽 위 분기점
 * @centerLeft 중앙인데 왼쪽으로 갈때
 * @centerRight 중앙인데 오른쪽으로 갈때
 * @none 아무것도 아닐때
 * */
type CornerType =
  | "leftTop"
  | "rightTop"
  | "centerLeft"
  | "centerRight"
  | "none";

interface UserInfoType {
  userId: string;
  playerName: string;
  profileImage: string;
}

export type { PieceStateType, GameActionType, CornerType, UserInfoType };
