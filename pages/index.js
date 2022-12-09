import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  return (
    <div className="root">
      <Head>
        <title>ConversationDesign.ai| Helper</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Conversation Design.ai <span>Helper</span></h1>
          </div>
          <div className="header-subtitle">
            <h2>Let's try that in a different voice</h2>
          </div>
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
