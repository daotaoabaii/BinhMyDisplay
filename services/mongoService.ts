// Note: This is a client-side service that communicates with a backend API
// MongoDB connection should be handled by the backend (Node.js/Express server)
// For now, we'll mock the API calls

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-image-finder';

let isConnected = false;

// Mock API endpoint - change this to your backend URL
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

export const connectMongoDB = async () => {
  // This is called from client, but connection happens on backend
  isConnected = true;
  console.log('Connected to MongoDB backend');
};

export const disconnectMongoDB = async () => {
  isConnected = false;
  console.log('Disconnected from MongoDB backend');
};

export const getLatestImages = async (limit: number = 10) => {
  try {
    // Call backend API instead of direct MongoDB
    const response = await fetch(`${API_BASE_URL}/images?limit=${limit}`);
    
    if (!response.ok) {
      // If backend not available, return empty array with mock data for testing
      console.warn('Backend API not available, using mock data');
      return [
        {
          _id: 'mock_1',
          searchQuery: 'test',
          imageId: 'img_test_1',
          imageName: 'test_image.jpg',
          imageUrl: 'https://via.placeholder.com/300',
          matchScore: 85,
          matchReason: 'Test image',
          source: 'upload',
          createdAt: new Date(),
        }
      ];
    }
    
    const images = await response.json();
    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    // Return empty array on error so app doesn't crash
    return [];
  }
};

export const getImageById = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/${id}`);
    
    if (!response.ok) {
      return null;
    }
    
    const image = await response.json();
    return image;
  } catch (error) {
    console.error('Error fetching image by ID:', error);
    return null;
  }
};

export const saveImage = async (imageData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save image');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};
