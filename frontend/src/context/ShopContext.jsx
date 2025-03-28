import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendURL } from "../App";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 50;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      return storedCart && storedCart !== "undefined"
        ? JSON.parse(storedCart)
        : {};
    } catch (error) {
      return {};
    }
  });

  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    setCartItems((prev) => {
      const cartData = { ...prev };
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
      return cartData;
    });

    if (token) {
      try {
        await axios.post(
          `${backendURL}/api/cart/add`,
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const getCartTotal = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += Number(cartItems[itemId][size] || 0);
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    setCartItems((prev) => {
      const cartData = { ...prev };
      if (cartData[itemId]) {
        cartData[itemId][size] = quantity;
      }
      return cartData;
    });

    if (token) {
      try {
        await axios.post(
          `${backendURL}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const productData = products.find((product) => product._id === itemId);
      if (productData) {
        for (const size in cartItems[itemId]) {
          totalAmount +=
            Number(cartItems[itemId][size] || 0) * productData.price;
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getUserCart = async (tokenValue) => {
    if (tokenValue) {
      try {
        // console.log("Fetching user cart from backend...");
        const response = await axios.post(
          `${backendURL}/api/cart/get`,
          {},
          { headers: { token: tokenValue } }
        );
        // console.log("Cart API Response:", response.data);
        if (response.data.success) {
          // console.log(
          //   "Setting cartItems from backend data:",
          //   response.data.cartData
          // );
          setCartItems(response.data.cartData);
          localStorage.setItem(
            "cartItems",
            JSON.stringify(response.data.cartData)
          );
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      getUserCart(savedToken);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartTotal,
    updateQuantity,
    getCartAmount,
    navigate,
    token,
    setToken,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
