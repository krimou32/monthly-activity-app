import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { BiLinkExternal, BiCheckCircle } from "react-icons/bi";

export default function ActivityCard({
  id,
  title,
  imgUrl,
  activityName,
  website,
  price,
  address,
  googleMapsUrl,
  onDone,
}) {
  // Function to mark the activity/restaurant as done
  const markAsDone = async () => {
    const docRef = doc(db, "activities", id); // Directly use the "activities" collection name
    await updateDoc(docRef, {
      done: true,
    });

    onDone && onDone(id, title);
  };

  return (
    <div className="card card-normal w-11/12 my-5 h-auto md:my-5 md:w-2/5 bg-base-300 shadow-xl">
      <figure>
        <img
          src={imgUrl}
          alt={activityName}
        />
      </figure>
      <div className="card-body">
        <h1 className="card-title">{title}</h1>
        <a
          href={website}
          target="_blank"
        >
          <h2 className="card-title">
            {activityName} <BiLinkExternal />
          </h2>
        </a>
        <ul>
          <li>£{price}</li>
          <li>
            <a
              href={googleMapsUrl}
              target="_blank"
            >
              {address} <BiLinkExternal />
            </a>
          </li>
        </ul>
        <div className="card-actions justify-end">
          <a
            href={website}
            target="_blank"
          >
            <button className="btn btn-primary">Check Activity</button>
          </a>
          <button
            className="btn btn-success"
            onClick={markAsDone}
          >
            Done <BiCheckCircle />
          </button>
        </div>
      </div>
    </div>
  );
}
