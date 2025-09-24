// 全局错误处理
const originalConsoleError = console.error;

// 重写 console.error 以避免循环错误
console.error = (...args) => {
  try {
    // 避免在错误处理中再次触发错误
    if (typeof args[0] === 'string' && args[0].includes('Global error caught')) {
      return;
    }
    originalConsoleError.apply(console, args);
  } catch (e) {
    // 如果 console.error 本身出错，直接输出到原始控制台
    originalConsoleError.call(console, 'Error in console.error:', e);
  }
};

// 更安全的全局错误处理
window.addEventListener('error', (event) => {
  try {
    // 避免 Script error 的无限循环
    if (event.message === 'Script error.' || 
        (typeof event.message === 'string' && event.message.includes('Script error'))) {
      originalConsoleError('Script error detected - likely CORS or third-party script issue');
      return true;
    }

    originalConsoleError('Global error caught:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.toString()
    });
    
    return true;
  } catch (e) {
    originalConsoleError('Error in error handler:', e);
    return true;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  try {
    originalConsoleError('Unhandled promise rejection:', event.reason);
    event.preventDefault();
    return true;
  } catch (e) {
    originalConsoleError('Error in unhandledrejection handler:', e);
    return true;
  }
});

export {};
