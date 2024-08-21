import {
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
  background-color: white;
  color: black;
  font-weight: 500;
  width: 100%;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
`;
const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("repo");
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button onClick={onClick}>
      <Logo src="/github-mark.svg" />
      깃허브 로그인
    </Button>
  );
}
