"use client";
import { useEffect, useState } from "react";

export default function Test() {
  const [data, setData] = useState("");
  const testApi = async () => {
    const response = await fetch("/api/");
    const respData = await response.json();
    setData(respData.message);
  };
  useEffect(() => {
    testApi();
  }, []);

  return <p>{data}</p>;
}
