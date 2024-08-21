import { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px 10px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9df0;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9df0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9df0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  background-color: #1d9df0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

const PostTweetForm = () => {
  const [isLaoding, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
      console.log(files[0]);
    }
  };

  return (
    <Form>
      <TextArea
        rows={5}
        maxLength={180}
        value={tweet}
        placeholder="지금 알리고 싶은 180글자는?"
        onChange={onChange}
      />
      <AttachFileButton htmlFor="file">
        {file ? `${file.name.split(".")[0]} 선택완료` : "사진선택"}
      </AttachFileButton>
      <AttachFileInput
        id="file"
        accept="image/*"
        type="file"
        onChange={onFileChange}
      />
      <SubmitBtn
        type="submit"
        value={isLaoding ? "날리는중..." : "트윗 날리기"}
      />
    </Form>
  );
};

export default PostTweetForm;
