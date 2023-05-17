import styled from "styled-components";
import { StyledButton } from "@/present/common/Button/Rect/RectButton.style";

const Container = styled.div`
  position: relative;
  margin: 0;
  width: 100vw;
  height: 100vh;
`;

const ButtonContainer = styled.div`
  width: 70vw;
  display: flex;
  justify-content: space-between;
  width: fit-contents;
  margin: auto;
`;

const ModalFormContainer = styled.form`
  margin-top: 100px;
  display: grid;
  place-items: center;
  grid-template-rows: repeat(2, 75px);
  grid-template-columns: repeat(2, 150px);
  grid-column-gap: 30px;
  grid-row-gap: 18px;
`;

const inputNickName = styled.input`
  grid-column: span 2;
  height: 65px;
  width: 350px;
  text-align: center; /* 수평 가운데 정렬 */
  line-height: 65px /* input의 높이와 동일한 값을 설정해주세요 */;
  appearance: none; /* 브라우저의 기본 스타일 무시 */
  outline: none; /* 클릭 시 발생하는 외곽선 제거 */
  font-size: large;
  border: thick double #575757;

  &:focus {
    border: thick double #c4c4c4; //클릭 시 변경할 border 색상
  }
`;
const ExitModalContainer = styled.div`
  border-radius: 20px;
  width: 135px;
  &:hover {
    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.4);
  }
`;

const IngressButton = styled(StyledButton)`
  border: none;

  &:hover {
    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.4);
  }
`;

export {
  Container,
  ButtonContainer,
  ExitModalContainer,
  inputNickName,
  IngressButton,
  ModalFormContainer,
};
