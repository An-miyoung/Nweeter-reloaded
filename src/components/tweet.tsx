import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
const TweetColumn = styled.div`
  display: flex;
  flex-direction: column;
`;
const PhotoColumn = styled.div`
  position: relative;
`;
const TextArea = styled.textarea`
  margin: 5px 0px;
  padding: 10px 5px;
  font-size: 16px;
  color: black;
  background-color: wheat;
  width: 90%;
  resize: none;
  &:focus {
    outline: none;
    border-color: #1d9df0;
  }
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;
const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  margin-top: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;
const EditButton = styled.button`
  background-color: white;
  color: #1d9df0;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  margin-top: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;
const ImageChangeButton = styled.label`
  position: absolute;
  bottom: 5px;
  left: 20px;
  background-color: white;
  color: #1d9df0;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  margin-top: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
`;
const ImageChangeInput = styled.input`
  display: none;
`;
const ButtonContainer = styled.div`
  width: 30%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

function Tweet({ tweet, photo, username, userId, id }: ITweet) {
  const [edit, setEdit] = useState(false);
  const [newTweet, setNewTweet] = useState("");
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [imgFile, setImgFile] = useState<string | ArrayBuffer | null>("");
  const user = auth.currentUser;

  const onEdit = () => {
    setEdit(true);
  };

  const onDelete = async () => {
    const ok = confirm("트윗을 삭제하시겠습니까?");
    if (!ok) return;

    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTweet(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || user.uid !== userId) return;

    try {
      const docRef = doc(db, "tweets", id);
      await updateDoc(docRef, {
        tweet: newTweet,
      });
      if (newPhoto) {
        const storageRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(storageRef);
        const result = await uploadBytes(storageRef, newPhoto);
        const url = await getDownloadURL(result.ref);
        // 이미지 url을 firestore 에 저장
        await updateDoc(docRef, {
          photo: url,
        });
      }
      setEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!user || !files || files.length === 0) return;
    if (files[0].size > 1024 * 1024) {
      alert("파일 크기는 1MB 이하여야 합니다.");
      return;
    }
    setNewPhoto(files[0]);

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
  };

  return (
    <Wrapper>
      <TweetColumn>
        <Username>{username}</Username>
        {edit ? (
          <TextArea
            rows={2}
            maxLength={180}
            placeholder={tweet}
            value={newTweet}
            onChange={onChange}
            required
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user && user.uid === userId && (
          <ButtonContainer>
            {edit ? (
              <form onSubmit={onSubmit}>
                <EditButton>수정완료</EditButton>
              </form>
            ) : (
              <EditButton onClick={onEdit}>수정시작</EditButton>
            )}
            <DeleteButton onClick={onDelete}>트윗삭제</DeleteButton>
          </ButtonContainer>
        )}
      </TweetColumn>
      {photo && (
        <PhotoColumn>
          {newPhoto !== null &&
          imgFile !== null &&
          typeof imgFile === "string" ? (
            <Photo src={imgFile} alt="photo" />
          ) : (
            <Photo src={photo} alt="photo" />
          )}
          {edit && (
            <>
              <ImageChangeButton htmlFor="newFile">사진변경</ImageChangeButton>
              <ImageChangeInput
                id="newFile"
                accept="image/*"
                type="file"
                onChange={onImageChange}
              />
            </>
          )}
        </PhotoColumn>
      )}
    </Wrapper>
  );
}

export default Tweet;
