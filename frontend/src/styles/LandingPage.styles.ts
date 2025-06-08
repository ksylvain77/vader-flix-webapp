import styled from 'styled-components';
import bgImage from '../assets/ds_bg.png';

const background = '#0D0D0D';
const foreground = '#1C1C1E';
const accent = '#E50914';
const textColor = '#FFFFFF';
const mutedText = '#A0A0A0';

export const StyledContainer = styled.div`
  position: relative;
  background-color: ${background};
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: ${textColor};
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const Logo = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${accent};
  word-break: break-word;
  z-index: 1;

  @media (max-width: 600px) {
    font-size: 2rem;
    padding: 0 1rem;
  }
`;

export const StyledPaper = styled.div`
  background-color: ${foreground};
  padding: 2rem;
  border-radius: 8px;
  z-index: 1;
  max-width: 600px;
  width: 100%;

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

export const StyledButton = styled.button`
  background-color: ${accent};
  color: ${textColor};
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 1;

  &:hover {
    background-color: #b0060f;
  }

  @media (max-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
`;
