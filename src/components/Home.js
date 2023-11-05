import { useEffect, useState } from "react";
import {
  query,
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import ActivityCard from "./ActivityCard";
import InputForm from "./InputForm";
import WindowMockup from "./WindowMockup";

function Home() {
  const [activities, setActivities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "activities"),
      async (snapshot) => {
        const activitiesData = [];
        const restaurantsData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.type === "Activity" && !data.done) {
            activitiesData.push({ id: doc.id, ...data });
          } else if (data.type === "Restaurant" && !data.done) {
            restaurantsData.push({ id: doc.id, ...data });
          }
        });

        // Update your state with the new data
        setActivities(activitiesData);
        setRestaurants(restaurantsData);

        // Logic to check if we need to update the current month's selection
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const selectionsDocRef = doc(db, "selections", "current");
        const selectionsDoc = await getDoc(selectionsDocRef);

        if (selectionsDoc.exists()) {
          const { month, year, activity, restaurant } = selectionsDoc.data();
          if (month === currentMonth && year === currentYear) {
            setSelectedActivity(activity);
            setSelectedRestaurant(restaurant);
          } else {
            // Logic to set new random selections if month and year don't match
            const randomActivity =
              activitiesData[Math.floor(Math.random() * activitiesData.length)];
            const randomRestaurant =
              restaurantsData[
                Math.floor(Math.random() * restaurantsData.length)
              ];

            await setDoc(selectionsDocRef, {
              month: currentMonth,
              year: currentYear,
              activity: randomActivity,
              restaurant: randomRestaurant,
            });

            setSelectedActivity(randomActivity);
            setSelectedRestaurant(randomRestaurant);
          }
        } else {
          // No selection for the current month exists, choose new random activities
          const randomActivity =
            activitiesData[Math.floor(Math.random() * activitiesData.length)];
          const randomRestaurant =
            restaurantsData[Math.floor(Math.random() * restaurantsData.length)];

          await setDoc(selectionsDocRef, {
            month: currentMonth,
            year: currentYear,
            activity: randomActivity,
            restaurant: randomRestaurant,
          });

          setSelectedActivity(randomActivity);
          setSelectedRestaurant(randomRestaurant);
        }
      }
    );

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  // New useEffect for setting up real-time listener on the "activities" collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "activities"), (snapshot) => {
      const newActivities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Activities from Firestore:", newActivities);
      setActivities(newActivities);
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  useEffect(() => {
    // This effect will run any time `activities` or `restaurants` change.
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const updateSelections = async () => {
      const selectionsDocRef = doc(db, "selections", "current");
      const selectionsDoc = await getDoc(selectionsDocRef);

      if (selectionsDoc.exists()) {
        const { month, year, activity, restaurant } = selectionsDoc.data();
        if (month === currentMonth && year === currentYear) {
          setSelectedActivity(activity);
          setSelectedRestaurant(restaurant);
        } else {
          const randomActivity = getRandomActivityOrRestaurant("Activity");
          const randomRestaurant = getRandomActivityOrRestaurant("Restaurant");

          await setDoc(selectionsDocRef, {
            month: currentMonth,
            year: currentYear,
            activity: randomActivity,
            restaurant: randomRestaurant,
          });

          setSelectedActivity(randomActivity);
          setSelectedRestaurant(randomRestaurant);
        }
      } else {
        const randomActivity = getRandomActivityOrRestaurant("Activity");
        const randomRestaurant = getRandomActivityOrRestaurant("Restaurant");

        await setDoc(selectionsDocRef, {
          month: currentMonth,
          year: currentYear,
          activity: randomActivity,
          restaurant: randomRestaurant,
        });

        setSelectedActivity(randomActivity);
        setSelectedRestaurant(randomRestaurant);
      }
    };

    updateSelections();
  }, [activities, restaurants]);

  const getRandomActivityOrRestaurant = (type) => {
    const data = type === "Activity" ? activities : restaurants;
    const notDoneItems = data.filter((item) => !item.done);
    if (notDoneItems.length > 0) {
      return notDoneItems[Math.floor(Math.random() * notDoneItems.length)];
    } else {
      // Optionally handle the case where all items are done
      console.warn(`All ${type}s are marked as done.`);
      return null;
    }
  };

  const handleDone = async (id, title) => {
    const type = title === "Activity" ? "Activity" : "Restaurant";
    const newSelection = await getRandomActivityOrRestaurant(type);

    const selectionsDocRef = doc(db, "selections", "current");
    await updateDoc(selectionsDocRef, {
      [type.toLowerCase()]: newSelection,
    });

    if (type === "Activity") {
      setSelectedActivity(newSelection);
    } else {
      setSelectedRestaurant(newSelection);
    }
  };

  return (
    <div className="container mx-auto">
      <header>
        <WindowMockup />
      </header>
      <div className="flex flex-col items-center md:flex-row justify-around my-10">
        {selectedActivity && (
          <ActivityCard
            id={selectedActivity.id}
            title="Activity"
            imgUrl={selectedActivity.imgUrl}
            activityName={selectedActivity.name}
            website={selectedActivity.website}
            price={selectedActivity.price}
            address={selectedActivity.address}
            googleMapsUrl={selectedActivity.mapsUrl}
            onDone={handleDone}
          />
        )}
        {selectedRestaurant && (
          <ActivityCard
            id={selectedRestaurant.id}
            title="Restaurant"
            imgUrl={selectedRestaurant.imgUrl}
            activityName={selectedRestaurant.name}
            website={selectedRestaurant.website}
            price={selectedRestaurant.price}
            address={selectedRestaurant.address}
            googleMapsUrl={selectedRestaurant.mapsUrl}
            onDone={handleDone}
          />
        )}
      </div>
      <InputForm />
    </div>
  );
}

export default Home;
