import styled from "styled-components";

export default function Nav(): JSX.Element {
  return (
    <NavWrapSt id="nav" className="scroll">
      <NavContainerSt>Nav</NavContainerSt>
    </NavWrapSt>
  );
}

const NavWrapSt = styled.nav`
  width: 160px;
  padding: 20px;
  border-right: 0.5px solid var(--primary-color);
  overflow-y: auto;
`;
const NavContainerSt = styled.div`
  width: 100%;
`;
