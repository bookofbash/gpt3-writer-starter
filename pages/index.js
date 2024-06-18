import Head from 'next/head';
import 'material-icons/iconfont/material-icons.css';
import { useState, useEffect, useRef } from 'react';

const OutputLine = ({ item }) => {
  const textAreaRef = useRef(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [item.message]);

  return (
    item.message.trim() !== '' && (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <textarea
          ref={textAreaRef}
          value={`${item.tone}: ${item.message}`}
          style={{ flex: 1, resize: 'none', overflowY: 'auto' }}
          readOnly
        />
        <i
          className="material-icons"
          style={{ cursor: 'pointer' }}
          onClick={() => navigator.clipboard.writeText(`${item.tone}: ${item.message}`)}
        >
          content_copy
        </i>
      </div>
    )
  );
};


// ... your existing Home component code
const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    
    let apiOutput = []; // Initialize apiOutput
  
    // Attempt to make the API call up to 3 times
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const responsePromise = fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInput }),
        });
  
        // Use Promise.race to add a timeout of 10 seconds
        const timeoutPromise = new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Timeout occurred')), 10000);
        });
  
        // Wait for either the fetch response or the timeout
        const response = await Promise.race([responsePromise, timeoutPromise]);
  
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
  
        const data = await response.json();
        setApiOutput(data.outputs); // Update this to match the expected structure from the backend
        console.log("Output: ", data.outputs);
        break; // Exit the loop if successful response
      } catch (error) {
        console.error('Error fetching data:', error);
        apiOutput = []; // Ensure this is an empty array to handle mapping in render
      }
    }
  
    // After attempting 3 times, if apiOutput is still empty, display error message
    if (apiOutput.length === 0) {
      console.log("We're making too many API calls at the moment.");
      // Handle your UI or error state as needed
      apiOutput="We're making too many API calls at the moment."
    }
  
    setIsGenerating(false);
  };
  



  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  }
  return (
    <div className="root">
      <Head>
        <title>ConversationDesign.ai| Helper</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Conversation Design.ai <span>WordWeave</span></h1>
          </div>
          <div className="header-subtitle">
            <h2>Make Your Conversations More Dynamic. Type a sentence and get creative variations.</h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            placeholder="start typing here"
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText} />
          <div className="prompt-buttons">
            <button
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={callGenerateEndpoint}
              disabled={isGenerating}
            >
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
            </button>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Try these!</h3>
                </div>
              </div>
              <div className="output-content">
                {apiOutput.map((item, index) => (
                  <OutputLine key={index} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
