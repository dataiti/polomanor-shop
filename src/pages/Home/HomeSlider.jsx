import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../../firebase/firebaseConfig";
import Banner from "../../components/Banner";

function HomeSlider({ setLoading }) {
  const [listSlider, setListSlider] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchApi = async () => {
      try {
        const bannerColRef = collection(db, "banner");
        onSnapshot(bannerColRef, (snapshot) => {
          const result = [];
          snapshot.forEach((doc) => {
            result.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setListSlider(result);
          setLoading(false);
        });
      } catch (err) {
        setLoading(false);
      }
    };
    fetchApi();
  }, [setLoading]);

  return <Banner listBanner={listSlider} />;
}

export default HomeSlider;
