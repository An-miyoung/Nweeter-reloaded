import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import errorMessageToKorean from "../utils/errorMessageToKorean";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-styles";
import GithubButton from "../components/github-btn";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const initForm = () => {
    setLoading(false);
    setEmail("");
    setPassword("");
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isLoading || email === "" || password === "") {
      setError("이메일, 비밀번호는 필수입력입니다.");
      return;
    }

    //login
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      initForm();
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = errorMessageToKorean(error.code);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>X 로그인</Title>
      <Form onSubmit={onFormSubmit}>
        <Input
          name="email"
          value={email}
          type="email"
          placeholder="이메일"
          onChange={onInputChange}
          required
        />
        <Input
          name="password"
          value={password}
          type="password"
          placeholder="비밀번호"
          onChange={onInputChange}
          required
        />
        <Input
          type="submit"
          value={isLoading ? "로딩중..." : "로그인"}
          disabled={isLoading}
        />
      </Form>
      {error !== "" && <Error>{error}</Error>}
      <Switcher>
        아직 회원이 아니신가요? <Link to="/create-account">회원가입</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
