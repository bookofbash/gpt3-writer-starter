import Head from 'next/head';
import Image from 'next/image';
import 'material-icons/iconfont/material-icons.css';
import {useState, useEffect, useRef} from 'react';

const OutputLine = ({ line }) => {
  const cleanedLine = line.replace(/^\d+\.\s*/, '');
  const textAreaRef = useRef(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [cleanedLine]);

  return (
    cleanedLine.trim() !== '' && (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <textarea 
          ref={textAreaRef}
          value={cleanedLine} 
          style={{ flex: 1, resize: 'none', overflowY: 'auto' }} 
          readOnly 
        />
        <i 
          className="material-icons" 
          style={{ cursor: 'pointer' }} 
          onClick={() => navigator.clipboard.writeText(cleanedLine)}
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
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    
    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });
    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)
  
    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }
  
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
          <div className= "prompt-buttons">
            <a 
            className={isGenerating ? 'generate-button loading' : 'generate-button'}  
            onClick={callGenerateEndpoint}
            >
              <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
  <div className="output">
    <div className="output-header-container">
      <div className="output-header">
        <h3>Try these!</h3>
      </div>
    </div>
    <div className="output-content">
      {apiOutput.trim().split('\n').map((line, index) => (
        <OutputLine key={index} line={line} />
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
