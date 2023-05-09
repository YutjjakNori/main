import styled from "styled-components";

const Container = styled.div`
  * {
    font-family: Consolas, monospace;
    font-size: 16px;
  }
  .jb-text {
    width: 120px;
    height: 48px;
    padding: 15px 15px;
    /* padding: 0.5rem calc((100vw-1000px) / 2); */
    background-color: #444444;
    border-radius: 5px;
    color: #ffffff;
    position: absolute;
    opacity: 0;
    transition: all ease 0.5s;
  }
  .jb-title:hover + .jb-text {
    opacity: 1;
  }
`;

const Container2 = styled.div`
  position: relative;
  width: 30px;
`;

export { Container, Container2 };
