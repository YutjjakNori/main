import styled from "styled-components";
import backgroundImage from "@/public/image/gyeungbokgung_sunset.jpg";

const MainText = styled.div`
  font-size: 40vmin;
  font-weight: bold;
  text-align: center;
  padding: 85px 0;
  background-image: url(${backgroundImage.src});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

export { MainText };
