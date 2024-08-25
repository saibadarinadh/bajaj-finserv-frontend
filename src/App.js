import React, { useState } from 'react';
import { Container, TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Card, CardContent, Chip } from '@mui/material';
import axios from 'axios';

const App = () => {
  const [input, setInput] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [output, setOutput] = useState({});
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleOptionChange = (e) => {
    setSelectedOptions(e.target.value);
  };

  const handleSubmit = async () => {
    const apiUrl = 'https://bajaj-finserv-backend-bzyg.onrender.com/bfhl';

    try {
      // Validate and parse the JSON input
      const parsedInput = JSON.parse(input);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error('Invalid JSON format: data field is required and should be an array');
      }

      // Make the API request
      const response = await axios.post(apiUrl, { data: parsedInput.data, filter: selectedOptions });

      // Check for a successful response
      if (response.status === 200) {
        const data = response.data;

        // Build output result based on selected options
        let outputResult = {};

        if (selectedOptions.includes('Numbers')) {
          outputResult['Numbers'] = data.Numbers || 'None';
        }
        if (selectedOptions.includes('Alphabets')) {
          outputResult['Alphabets'] = data.Alphabets || 'None';
        }
        if (selectedOptions.includes('Highest lowercase alphabet')) {
          outputResult['Highest lowercase alphabet'] = data.HighestLowercaseAlphabet || 'None';
        }

        // Update state with the result
        setOutput(outputResult);
        setError('');
      } else {
        // Handle non-200 status codes
        setOutput({});
        setError(`API Error: ${response.statusText}`);
      }
    } catch (err) {
      // Handle JSON parsing errors or other exceptions
      setOutput({});
      if (err.response) {
        // Server error response
        setError(`API Error: ${err.response.statusText}`);
      } else if (err.request) {
        // No response received
        setError('API Error: No response from server');
      } else {
        // Error in setting up the request
        setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px'
      }}
    >
      <TextField
        label="API Input"
        value={input}
        onChange={handleInputChange}
        fullWidth
        variant="outlined"
        margin="normal"
        InputProps={{ style: { fontSize: '16px' } }} // Single-line input
      />
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Multi Filter</InputLabel>
        <Select
          multiple
          value={selectedOptions}
          onChange={handleOptionChange}
          renderValue={(selected) => (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} onDelete={() => setSelectedOptions(selectedOptions.filter(option => option !== value))} />
              ))}
            </div>
          )}
          label="Multi Filter"
        >
          <MenuItem value="Alphabets">Alphabets</MenuItem>
          <MenuItem value="Numbers">Numbers</MenuItem>
          <MenuItem value="Highest lowercase alphabet">Highest lowercase alphabet</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        Submit
      </Button>
      {error && (
        <Typography color="error" variant="body1" style={{ marginTop: '20px' }}>
          {error}
        </Typography>
      )}
      {Object.keys(output).length > 0 && (
        <Card variant="outlined" style={{ marginTop: '20px', width: '100%', maxWidth: '600px' }}>
          <CardContent>
            <Typography variant="h6">Filtered Response:</Typography>
            {Object.entries(output).map(([key, value]) => (
              <Typography key={key} variant="body1">
                {key}: {value}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default App;
