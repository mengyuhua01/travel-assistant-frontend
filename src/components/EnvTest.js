import React from 'react';

const EnvTest = () => {
  const token = process.env.REACT_APP_COZE_API_TOKEN;
  const botId = process.env.REACT_APP_COZE_BOT_ID;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>环境变量测试</h3>
      <p><strong>Token exists:</strong> {token ? '✓ Yes' : '✗ No'}</p>
      <p><strong>Token (first 10 chars):</strong> {token ? token.substring(0, 10) + '...' : 'Not found'}</p>
      <p><strong>Bot ID:</strong> {botId || 'Not found'}</p>
      <p><strong>Bot ID type:</strong> {typeof botId}</p>
      <hr />
      <p><strong>All REACT_APP env vars:</strong></p>
      <ul>
        {Object.keys(process.env)
          .filter(key => key.startsWith('REACT_APP'))
          .map(key => (
            <li key={key}>{key}: {process.env[key]}</li>
          ))
        }
      </ul>
    </div>
  );
};

export default EnvTest;
