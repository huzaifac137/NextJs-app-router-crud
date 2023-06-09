import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { Fragment } from "react";
import { getAllEvents } from "../../dummy-data";
import fs from "fs/promises";
import path from "path";
import NavBar from "../../components/navBar";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Logout from "../../components/Logout";

export const metadata = {
  title: "Huzaifa",
  description:
    "This is a next js app where you canfind the best developers across the pakistan",
};

async function fetchData() {
  let responseData;
  try {
    const response = await fetch("http://localhost:3000/api/products", {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    responseData = await response.json();
    if (response.status !== 200) {
      throw new Error(responseData.message);
    }
  } catch (error) {
    const errorMessage = ("ERROR : ", error.message);
    return errorMessage;
  }

  const products = responseData.products;
  console.log("PRODUCTS", products);
  console.log(products);

  return products;
}

async function Home(props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  const products = await fetchData();

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        {session ? <Logout /> : null}
        <h3>Logged in as : {session?.user?.name} </h3>
        <h4>email : {session?.user.email} </h4>
        <h1 style={{ marginBottom: "30px" }}>All Products</h1>

        {typeof products === "string" ? (
          <h2>{products}</h2>
        ) : products?.length === 0 ? (
          <h2>No products found!</h2>
        ) : (
          products?.map((item) => (
            <div key={item._id} className={styles.product}>
              <Image
                className={styles.image}
                src={"https://picsum.photos/200/300"}
                width={200}
                height={200}
              />
              <h2>{item.title}</h2>
              <h3>{item.price}</h3>
              <Link
                href={{
                  pathname: `/post/${item._id}`,
                  query: {
                    title: item.title,
                    price: item.price,
                    creatorName: item.creatorName,
                    creator: item.creator,
                  },
                }}
              >
                Proceed
              </Link>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default Home;
