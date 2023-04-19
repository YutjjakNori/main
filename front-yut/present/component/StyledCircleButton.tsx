import styled from "styled-components";

function StyledCircleButton() {
  return (
    <>
      <StyledButton>배경음</StyledButton>
    </>
  );
}

const StyledButton = styled.button`
  margin-left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: #575757;
  background-color: white;
  border: 1px solid #575757;
  display: inline-block;
`;

export default StyledCircleButton;
