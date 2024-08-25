require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const apiClient = axios.create({
    baseURL: 'https://api.pipedrive.com/v1',
    params: { api_token: process.env.PIPEDRIVE_API_KEY }
  });
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  
  app.post('/api/create-deal', async (req, res) => {
    try {
      const { firstName, lastName, phone, email, jobType, jobSource, jobDescription, address, city, state, zipCode, area, startDate, startTime, endTime, testSelect } = req.body;
  
      const personResponse = await apiClient.post('/persons', {
        name: `${firstName} ${lastName}`,
        email,
        phone
      });
  
      const personId = personResponse.data.data.id;
  
      const dealResponse = await apiClient.post('/deals', {
        title: `${firstName} ${lastName}'s Deal`,
        person_id: personId,
        custom_fields: {
          job_type: jobType,
          job_source: jobSource,
          job_description: jobDescription,
          address,
          city,
          state,
          zip_code: zipCode,
          area,
          start_date: startDate,
          start_time: startTime,
          end_time: endTime,
          test_select: testSelect
        }
      });
  
      res.status(201).json({ message: 'Deal created successfully', deal: dealResponse.data });
    } catch (error) {
      console.error('Error creating deal:', error.message);
      res.status(500).json({ message: 'Failed to create deal' });
    }
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  