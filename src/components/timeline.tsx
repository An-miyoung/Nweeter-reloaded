import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export interface ITweet {
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
  id: string;
}

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      // snapshot 에 listner 를 달아 내용이 변할때 마다 다시 가져온다.
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
      });
    };

    fetchTweets();
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.length > 0 &&
        tweets.map((item) => <Tweet key={item.id} {...item} />)}
    </Wrapper>
  );
}
