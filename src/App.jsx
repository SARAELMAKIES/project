
import { useState } from 'react'
import React from 'react';
import Form from './Form';  // מייבא את הקומפוננטה Form

const App = () => {  // פונקציה App
  return (
    <div>
      <h1></h1>
      <Form />  {/* הצגת הקומפוננטה Form */}
    </div>
  );
}

export default App;  // מייצא את הקומפוננטה App