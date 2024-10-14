"use client";
import { hc } from "hono/client";
import { useEffect, useState } from "react";
import { AppType } from "./api/[...route]";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const client = hc<AppType>("/");
      const res = await client.api.v1.hello.$get();
      console.log(res);
      const { message: resData } = await res.json();

      setMessage(resData);
    };
    fetchData();
  }, []);

  if (!message) return <p>Loading...</p>;

  return <p>{message}</p>;
}
