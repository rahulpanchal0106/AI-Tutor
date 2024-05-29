import React, { useContext, useEffect, useState } from "react";
import "./layer2Card.css";
import Layer3 from "../../page/layer3/Layer3";
import Cookies from 'js-cookie'; // Import Cookies
import { MyContext } from "../../context/MyContext";

const Layer2Card = ({
  lessonName,
  lessonContent,
  chapter,
  level,
  subject,
  index,
}) => {
  const [showLayer3, setShowLayer3] = useState(false);
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(false); // State to manage loading

  const {DBl2} = useContext(MyContext)

  useEffect(()=>{
    if(DBl2 && !data && DBl2.DBl2){
      // console.log("🤡🤡🤡🤡🤡 ",lessonName ,DBl2.DBl2&& DBl2?DBl2.DBl2.layer3[0]:"")
      setData(DBl2.DBl2&&DBl2.DBl2.layer3[index]?DBl2.DBl2.layer3[index].response:null)
    }
  },[DBl2])

  const fetchData = async () => {
    setLoading(true); // Set loading to true
    // Fetch data
    const token = Cookies.get('token'); // Get token from cookies
    try {
      const response = await fetch("http://localhost:3000/layer3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: {
            lessonName: lessonName,
            lessonContent: lessonContent,
            chapter: chapter,
            levelName: level,
            subject: subject,
          },
        }),
      });

      const resultData = await response.json();
      if (response.status === 501) {
        setData(resultData.error);
      } else if (!response.ok) {
        throw new Error(
          resultData.message || "Failed to get result from backend."
        );
      }
      setData(resultData.result);
    } catch (error) {
      console.error("Error:", error.message);
      setData(null);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleClick = () => {
    setShowLayer3(!showLayer3);
    if (!data && !showLayer3 && !loading) {
      fetchData(); // Fetch data only if not already fetched
    }
  };
 
  return (
    <div className="layer-container">
      <div
        className={`layer2-card-out ${showLayer3 ? "active" : ""}`}
        onClick={handleClick}
      >
        <div className={`layer2-card-in ${showLayer3 ? "active" : ""}`}>
          <p style={{position: "absolute"}}>{data?" 🔥":" ⭕"}</p>
          <h3>
          
            <strong className="lesson">{lessonName} </strong>
          </h3>
          <p className="lessonContent">{lessonContent}</p>
        </div>
        <button className="accordion-button">
          {showLayer3 ? "-" : "+"}
        </button>
      </div>
      <div style={{ display: showLayer3 ? "block" : "none" }}>

        <Layer3
          lessonName={lessonName}
          lessonContent={lessonContent}
          chapter={chapter}
          level={level}
          subject={subject}
          data={data} // Pass data to Layer3 component
          fetchData={fetchData} // Pass fetchData function to Layer3 component
          loading={loading} // Pass loading state to Layer3 component
        />
      </div>
    </div>
  );
};

export default Layer2Card;
