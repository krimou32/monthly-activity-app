import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function ActivitiesList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "activities"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setData(items);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <ul>
        {data.map((item) => (
          <li
            key={item.id}
            className="mb-4"
          >
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p>{item.type}</p>
              <p>Done: {item.done ? "Yes" : "No"}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivitiesList;
