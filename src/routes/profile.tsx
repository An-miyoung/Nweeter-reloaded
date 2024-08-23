import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const Input = styled.input`
  padding: 5px 10px;
  border-radius: 50px;
  border: none;
  width: 80%;
  font-size: 16px;
`;
const EditButton = styled.button`
  background-color: transparent;
  color: #1d9df0;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: #1d9df0;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Tweets = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState("");

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!user || !files || files.length === 0) return;

    const file = files[0];
    const storageRef = ref(storage, `avatars/${user.uid}`);
    const result = await uploadBytes(storageRef, file);
    const avatarUrl = await getDownloadURL(result.ref);
    setAvatar(avatarUrl);
    await updateProfile(user, {
      photoURL: avatarUrl,
    });
  };

  const onEdit = () => {
    setEdit(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateProfile(user, {
        displayName: newName,
      });
      setEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTweets = async () => {
    if (!user) return;

    const tweetsQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );

    // snapshot 에 listner 를 달아 내용이 변할때 마다 다시 가져온다.
    const snapshot = await getDocs(tweetsQuery);

    const tweets = snapshot.docs.map((doc) => {
      const { tweet, photo, userId, username, createdAt } = doc.data();
      return {
        tweet,
        photo,
        userId,
        username,
        createdAt,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        id="avatar"
        type="file"
        accept="image/*"
        onChange={onAvatarChange}
      />
      <NameContainer>
        {edit ? (
          <Input
            placeholder={user?.displayName ?? "익명"}
            value={newName}
            onChange={onChange}
            required
          />
        ) : (
          <Name>{user?.displayName ?? "익명"}</Name>
        )}
        {edit ? (
          <form onSubmit={onSubmit}>
            <EditButton>완료</EditButton>
          </form>
        ) : (
          <EditButton onClick={onEdit}>이름수정</EditButton>
        )}
      </NameContainer>
      <Tweets>
        {tweets.map((item) => (
          <Tweet key={item.id} {...item} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
