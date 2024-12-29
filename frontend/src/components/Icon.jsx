import styled from 'styled-components';

// Updated to forward additional props like onClick
export default function Icon({ background, children, ...props }) {
  return (
    <StyledIcon background={background} {...props}>
      {children}
    </StyledIcon>
  );
}

const StyledIcon = styled.div`
  height: 3.5rem;
  width: 3.5rem;
  background: ${(props) => props.background};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4rem;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;
