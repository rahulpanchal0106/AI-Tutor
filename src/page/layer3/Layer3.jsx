// import { useLocation } from "react-router-dom";
// import { useEffect, useState, useRef } from "react";
// import "./layer3.css"; // Import your CSS file for styling
// import Cookies from "js-cookies";
// import HashLoader from "react-spinners/HashLoader";
// import Doubt from "../../components/doubts/Doubt";
// import hljs from 'highlight.js';
// import 'highlight.js/styles/atom-one-dark.css';

// const Layer3 = () => {
//   const location = useLocation();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [quizData, setQuizData] = useState(null);
//   const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false); // State to track quiz generation loading
//   const prevLocationRef = useRef(null);

//   useEffect(() => {
//     //fetching layer3 data
//     const fetchData = async () => {
//       setLoading(true);
//       const token = Cookies.getItem("token");
//       try {
//         const response = await fetch("http://localhost:3000/layer3", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             prompt: {
//               lessonName: location.state.lessonName,
//               lessonContent: location.state.lessonContent,
//               chapter: location.state.chapter,
//               levelName: location.state.level,
//               subject: location.state.subject,
//             },
//           }),
//         });

//         const resultData = await response.json();
//         if (response.status === 501) {
//           setData(resultData.error);
//           setError(resultData.error);
//         } else if (!response.ok) {
//           throw new Error(
//             resultData.message || "Failed to get result from backend."
//           );
//         }
//         setData(resultData.result);
//         setError(null);
//       } catch (error) {
//         console.error("Error:", error.message);
//         setError(error.message);
//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Check if location has changed
//     if (prevLocationRef.current !== location.pathname) {
//       fetchData();
//       prevLocationRef.current = location.pathname;
//     }
//   }, [location.pathname]);

//   // generating quiz from above explained topic
//   const generateQuiz = async () => {
//     setIsGeneratingQuiz(true); // Set loading state to true when generating quiz
//     const token = Cookies.getItem("token");
//     try {
//       const response = await fetch("http://localhost:3000/quiz", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           prompt: {
//             data: data,
//           },
//         }),
//       });
//       const resultData = await response.json();
//       console.log(resultData);
//       setQuizData(resultData);
//     } catch (error) {
//       console.error("Error:", error.message);
//     } finally {
//       setIsGeneratingQuiz(false); // Set loading state to false when quiz generation is done
//     }
//   };
//   useEffect(() => {
//     // Highlight code blocks
//     if (data) {
//       hljs.highlightAll();
//     }
//   }, [data]);
//   if (loading)
//     return (
//       <div className="loadingContainer">
//         <HashLoader color="#616A6B" />
//       </div>
//     );
//   if (error) return <div className="error">Error: {error}</div>;
//   if (!data) return null;

//   // Split data into paragraphs
// const cleanedParagraphs = data.split("\n").map((paragraph, index) => {
//   // Use regular expression to replace asterisks and numbers with an empty string
//   const cleanedText = paragraph.replace(/[*0-9]/g, "");
//   return <p key={index}>{cleanedText}</p>;
// });

//   return (
//     <div className="layer3-container">
//       <h1>Level 3 Data</h1>
//       <h2>{location.state.lessonName}</h2>
//       <div className="data">{cleanedParagraphs}</div>

//       <div className="button-container">
//         <button onClick={generateQuiz} disabled={isGeneratingQuiz} className="bi">
//           {isGeneratingQuiz ? (
//             <div className="spinner" /> // Show spinner while generating quiz
//           ) : (
//             "Generate Quiz"
//           )}
//         </button>
//       </div>
//       <br />
//       {quizData && (
//         <div>
//           {quizData.result.split("\n").map((line, index) => (
//             <p key={index}>{line}</p>
//           ))}
//         </div>
//       )}
//       <br />
//       <br />
//       <div className="doubt-container">
//         <Doubt
//           lessonName={location.state.lessonName}
//           chapter= {location.state.chapter}
//           subject= {location.state.subject}
//           lessonExplaination = {data}
//         />
//       </div>
//     </div>
//   );
// };

// export default Layer3;

/// don't erase commented code
import { useLocation } from "react-router-dom";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Latex from "react-latex";
import "./layer3.css"; // Import your CSS file for styling
import Cookies from "js-cookies";
import HashLoader from "react-spinners/HashLoader";
import Doubt from "../../components/doubts/Doubt";
import hljs from "highlight.js";
import "highlight.js/styles/night-owl.css";
import Highlight from 'react-highlight';

const Layer3 = ({
  lessonName,
  lessonContent,
  chapter,
  level,
  subject,
  data,
  fetchData,
  loading,
}) => {
  const location = useLocation();
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false); // State to track quiz generation loading
  const [fullScreen, setFullScreen] = useState(false);

  const generateQuiz = async () => {
    setIsGeneratingQuiz(true); // Set loading state to true when generating quiz
    const token = Cookies.getItem("token");
    try {
      const response = await fetch("https://ai-tutor-be.onrender.com/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: {
            data: data,
          },
        }),
      });
      const resultData = await response.json();
      console.log(resultData);
      setQuizData(resultData);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setIsGeneratingQuiz(false); // Set loading state to false when quiz generation is done
    }
  };

  function handleFullScreenMode() {
    setFullScreen(!fullScreen);
  }

  const renderLatexExpressions = (text) => {
    const latexRegex = /\$(.*?)\$/g;
    const parts = text.split(latexRegex);

    return parts.map((part, index) => {
      return index % 2 === 0 ? part : <Latex key={index}>{part}</Latex>;
    });
  };

  return (
    <div className="layer3-container">
      <div className={`layer3-resp ${fullScreen ? 'fullscreen' : ''}`} style={fullScreen ? { 
        top: '0px',
        zIndex: '50',
        position: 'fixed',
        width: '100%',
        height: '100vh',
        padding: 'inherit',
        background: 'rgb(223, 223, 223)',
        left: '0px',
        overflow: 'auto'
      } : {}}>
        <div className="layer3info">
          <h2 className="lessonName">{lessonName}</h2>
          <div className="actions">
            <button onClick={handleFullScreenMode} >Full screen</button>
          </div>
        </div>
        {loading ?
          <div className="loadingContainer">
            <HashLoader color="#616A6B" />
          </div>
          : ''
        }
        {data && (
          <div>
            <div className="markdown-content">
              <ReactMarkdown>
                {data.replace(/\$\$(.*?)\$\$/g, "")}
              </ReactMarkdown>
            </div>
            <div className="latex-content">
              {renderLatexExpressions(data)}
            </div>
            <div className="button-container">
              <button
                onClick={fetchData}
                disabled={loading}
                className="bi"
              >
                {loading ? (
                  <div className="spinner" />
                ) : (
                  "Regenerate Lesson"
                )}
              </button>
              <button
                onClick={generateQuiz}
                disabled={isGeneratingQuiz}
                className="bi"
              >
                {isGeneratingQuiz ? (
                  <div className="spinner" /> // Show spinner while generating quiz
                ) : (
                  "Generate Quiz"
                )}
              </button>
            </div>
            {quizData && (
              <div>
                {quizData.result.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
            <div className="doubt-container">
              <Doubt
                lessonName={lessonName}
                chapter={chapter}
                subject={location.state.subject}
                lessonExplaination={data}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layer3;
