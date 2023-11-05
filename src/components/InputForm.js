import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export default function InputForm() {
  const [formData, setFormData] = useState({
    name: "",
    mapsUrl: "",
    price: "",
    website: "",
    type: "",
    address: "",
    image: null,
  });

  async function uploadImage(file) {
    const storage = getStorage(); // Get Firebase Storage instance
    const storageRef = ref(storage, "images/" + file.name); // Create a reference to the file
    const uploadTask = uploadBytesResumable(storageRef, file); // Create and start the upload task

    // Await the completion of the upload task
    const snapshot = await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: Track progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => reject(error),
        () => resolve(uploadTask.snapshot)
      );
    });

    // Get and return the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imgUrl = formData.image ? await uploadImage(formData.image) : null;

      // Create a new document in the "activities" collection with the form data
      const docRef = await addDoc(collection(db, "activities"), {
        name: formData.name,
        mapsUrl: formData.mapsUrl,
        price: formData.price,
        website: formData.website,
        type: formData.type,
        address: formData.address, // Added address field
        imgUrl, // Added image URL field
        done: false,
      });
      console.log("Document written with ID: ", docRef.id);

      // Reset form data
      setFormData({
        name: "",
        mapsUrl: "",
        price: "",
        website: "",
        type: "",
        address: "", // Reset address field
        image: null, // Reset image field
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="container rounded-3xl shadow-xl p-10 bg-base-200 my-20">
      <div className="prose my-10">
        <h1>ADD NEW</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input input-bordered"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="mapsUrl"
            className="mb-1"
          >
            Google Maps URL
          </label>
          <input
            type="url"
            id="mapsUrl"
            name="mapsUrl"
            value={formData.mapsUrl}
            onChange={handleInputChange}
            className="input input-bordered"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="price"
            className="mb-1"
          >
            Price
          </label>
          <div className="input-group">
            <span className="input-group-addon">£</span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="input input-bordered"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="website"
            className="mb-1"
          >
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="input input-bordered"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="address"
            className="mb-1"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="input input-bordered"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="image"
            className="mb-1"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleInputChange}
            className="file-input file-input-bordered w-full max-w-xs"
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-1">Type</span>
          <div className="flex flex-col my-5">
            <label className="flex mb-5">
              <input
                className="radio mr-2"
                type="radio"
                name="type"
                value="Activity"
                checked={formData.type === "Activity"}
                onChange={handleInputChange}
              />
              Activity
            </label>
            <label className="flex">
              <input
                className="radio mr-2"
                type="radio"
                name="type"
                value="Restaurant"
                checked={formData.type === "Restaurant"}
                onChange={handleInputChange}
              />
              Restaurant
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-wide"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
