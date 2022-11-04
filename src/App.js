import { collection, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import { auth, db } from "./firebase/firebaseConfig";
import { login, logout, selectUser } from "./redux/features/userSlice";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Shop from "./pages/Shop";
import Cart, { Payment } from "./pages/Cart";
import {
  AddProduct,
  ManageOrder,
  ManageProduct,
  ManageUser,
  UpdateProduct,
} from "./pages/Dashborad";
import { configRoutes } from "./utils/configRoutes";
import FindNotFound from "./pages/FindNotFound";
import Detail from "./pages/Detail";

function App() {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUser);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = query(
          collection(db, "user"),
          where("email", "==", user.email)
        );
        onSnapshot(userDocRef, (snapshot) => {
          snapshot.forEach((doc) => {
            dispatch(
              login({
                ...doc.data(),
                createAt: doc.data().createAt?.seconds * 1000,
              })
            );
          });
        });
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<Navigate to={configRoutes.home} replace={true} />}
        />
        <Route path={configRoutes.home} element={<Home />} />
        <Route path={configRoutes.product} element={<Shop />} />
        <Route path={configRoutes.cart} element={<Cart />} />
        <Route path={configRoutes.payment} element={<Payment />} />
        <Route path={configRoutes.productDetail} element={<Detail />} />
        {userInfo ? (
          <>
            <Route path={configRoutes.manageUser} element={<ManageUser />} />
            <Route
              path={configRoutes.manageProduct}
              element={<ManageProduct />}
            />
            <Route path={configRoutes.addProduct} element={<AddProduct />} />
            <Route
              path={configRoutes.updateProduct}
              element={<UpdateProduct />}
            />
            <Route path={configRoutes.manageOrder} element={<ManageOrder />} />
          </>
        ) : (
          <Route element={<Navigate to={configRoutes.home} replace={true} />} />
        )}
      </Route>
      <Route path={configRoutes.signIn} element={<SignIn />} />
      <Route path={configRoutes.signUp} element={<SignUp />} />
      <Route path={configRoutes.findNotFound} element={<FindNotFound />} />
    </Routes>
  );
}

export default App;
