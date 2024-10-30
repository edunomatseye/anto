import styled from 'tailwind';

const StyledShip = styled.div`
  color: pink;
`;

export function Ship() {
  return (
    <StyledShip>
      <h1>Welcome to Ship!</h1>
    </StyledShip>
  );
}

export default Ship;
