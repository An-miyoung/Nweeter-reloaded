import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import errorMessageToKorean from "../utils/errorMessageToKorean";
import {
  Title,
  Wrapper,
  Input,
  Switcher,
  Error,
  Form,
} from "../components/auth-styles";

function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const initForm = () => {
    setLoading(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isLoading || name === "" || email === "" || password === "") {
      setError("이름, 이메일, 비밀번호는 필수입력입니다.");
      return;
    }
    // create account
    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // 사용자이름 추가하기
      await updateProfile(user, {
        displayName: name,
      });
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
      <Title>X 계정만들기</Title>
      <Form onSubmit={onFormSubmit}>
        <Input
          name="name"
          value={name}
          type="text"
          placeholder="이름"
          onChange={onInputChange}
          required
        />
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
          value={isLoading ? "로딩중..." : "계정만들기"}
          disabled={isLoading}
        />
      </Form>
      {error !== "" && <Error>{error}</Error>}
      <Switcher>
        이미 회원이신가요? <Link to="/login">로그인</Link>
      </Switcher>
    </Wrapper>
  );
}

export default CreateAccount;
