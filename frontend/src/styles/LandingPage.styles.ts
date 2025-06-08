import styled from 'styled-components';

const background = '#0A0A0A';  // Darker background for castle feel
const foreground = '#1A1A1A';  // Slightly lighter than background
const accent = '#FF3D00';      // Lava-like orange-red
const textColor = '#FFFFFF';
const mutedText = '#8B8B8B';   // Muted text for contrast

export const StyledContainer = styled.div`
  position: relative;
  background-color: ${background};
  color: ${textColor};
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 61, 0, 0.05),
    rgba(10, 10, 10, 0.95)
  );
`;

export const BackgroundImage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  background: url('https://tse2.mm.bing.net/th?id=OIP.nKYyKp2w6VHJKFDIkzUxggHaEJ') no-repeat center/contain;
  opacity: 0.08;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;

  @media (max-width: 600px) {
    width: 250px;
    height: 250px;
  }
`;

export const Logo = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${accent};
  word-break: break-word;
  z-index: 1;
  text-shadow: 0 0 10px rgba(255, 61, 0, 0.3);

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
  box-shadow: 0 0 20px rgba(255, 61, 0, 0.1);
  border: 1px solid rgba(255, 61, 0, 0.1);

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
  transition: all 0.3s ease;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 0 15px rgba(255, 61, 0, 0.2);

  &:hover {
    background-color: #FF5722;
    box-shadow: 0 0 20px rgba(255, 61, 0, 0.4);
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
`;
