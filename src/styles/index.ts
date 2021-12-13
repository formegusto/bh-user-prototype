import styled from "styled-components";

export const BoxWrap = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;

  & > div {
    flex: 1;
  }

  & > div:not(:last-child) {
    margin: 0 10px 0 0;
  }
`;
export const Box = styled.div`
  height: 400px;
  border: 1px solid #333;

  display: flex;
  flex-direction: column;
`;

export const BoxTitle = styled.h1`
  font-size: 24px;
`;

export const BoxBody = styled.div`
  flex: 1;
  padding: 10px;
  font-size: 12px;

  overflow: scroll;
  max-width: 200px;
`;
