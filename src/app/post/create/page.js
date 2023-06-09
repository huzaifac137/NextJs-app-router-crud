"use client";
import React, { useState } from "react";
import styles from "../../page.module.css";

function page() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  async function postData() {
    if (title === "" || price === 0) {
      alert("Plase insert title and price correctly");
      return;
    }

    let responseData;
    try {
      setResponseMsg("");
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/products/post", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: title,
          price: price,
        }),
      });

      responseData = await response.json();
      if (response.status !== 201) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);
    } catch (error) {
      setResponseMsg("ERROR : ", error.message);
      setIsLoading(false);
      return;
    }

    setResponseMsg(responseData.message);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px",
      }}
    >
      {isLoading === true && <h2>Loading...</h2>}
      {responseMsg !== "" && <h2>{responseMsg}</h2>}
      <input
        className={styles.input}
        type="text"
        placeholder="title"
        value={title}
        onChange={handleTitle}
      />
      <input
        className={styles.input}
        type="number"
        placeholder="price"
        value={price}
        onChange={handlePrice}
      />
      <button onClick={postData}>POST DATA</button>
    </div>
  );
}

export default page;