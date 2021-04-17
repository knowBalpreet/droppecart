import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import Head from "next/head";

import styles from "../styles/Home.module.scss";

import Accordion from "../components/Accordion";

import { fetchCarts, fetchProducts, fetchUsers } from "../services/api";
import Filters from "../components/Filters";
import { RootState } from "../types";

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentView, toggleView] = useState("users");

  const state = useRef<RootState>({
    carts: [],
    products: [],
    users: [],
  });

  const setState = (newState) =>
    (state.current = { ...state.current, ...newState });

  const fetchData = async () => {
    setLoaded(false);
    try {
      const [[carts, cartsErr], [users, usersErr]] = await Promise.all([
        fetchCarts(),
        fetchUsers(),
      ]);

      if (cartsErr || usersErr) {
        throw new Error("Cannot fetch carts || users");
      }

      let productIds = _.uniq(
        _.flatten(carts.map(({ products }) => _.map(products, "productId")))
      );

      const [products, productsErr] = await fetchProducts(productIds);

      if (productsErr) {
        throw new Error("Cannot fetch products");
      }

      setState({ carts, users, products });
    } catch (error) {
      console.log("error occured :", error);
      setError(true);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleCurrentView = () => {
    const view = currentView === "users" ? "products" : "users";
    toggleView(view);
  };

  if (!loaded || error) {
    return (
      <div className="flex flex-center flex-align-center h-100">
        {!loaded && <div className="loader" />}
        {error && <h3>Some Error occured, Try reloading!</h3>}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Droppe Cart</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Filters currentView={currentView} toggle={toggleCurrentView} />
        <br />
        {state.current.carts && (
          <Accordion {...state.current} currentView={currentView} />
        )}
      </main>
    </div>
  );
};

export default Home;
