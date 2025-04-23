import { Platform } from 'react-native';

// Mock API response data
const mockHomeData = {
  weather: {
    current: {
      temp: 32,
      condition: 'partly-cloudy',
      date: '18 अप्रैल, 2025',
      day: 'शुक्रवार',
    },
    forecast: [
      { day: 'आज', temp: 32, icon: 'sunny', humidity: 45, wind: 12 },
      { day: 'शनि', temp: 31, icon: 'partly-cloudy', humidity: 52, wind: 8 },
      { day: 'रवि', temp: 28, icon: 'rainy', humidity: 78, wind: 15, isWarning: true }
    ],
    warning: {
      title: 'फसल चेतावनी',
      message: 'रविवार को तेज बारिश की चेतावनी - फसल सुरक्षा के लिए तैयारी करें'
    }
  },
  marketPrices: {
    topMarkets: [
      { id: 1, name: 'बारानी मंडी', distance: '15 किमी दूर', price: '2,580', location: { lat: 26.8467, lng: 80.9462 } },
      { id: 2, name: 'सिंचाई मंडी', distance: '22 किमी दूर', price: '2,650', location: { lat: 26.8467, lng: 80.9462 } },
      { id: 3, name: 'किसान मंडी', distance: '28 किमी दूर', price: '2,480', location: { lat: 26.8467, lng: 80.9462 } }
    ],
    todayRates: [
      { id: 1, cropName: 'गेहूं', priceRange: '₹2,580 - ₹2,750', trend: 'up' },
      { id: 2, cropName: 'धान', priceRange: '₹2,100 - ₹2,300', trend: 'down' },
      { id: 3, cropName: 'मक्का', priceRange: '₹1,800 - ₹2,000', trend: 'stable' }
    ],
    seeAllScreen: 'MarketPrices' // Screen to navigate to on See All
  },
  schemes: {
    items: [
      {
        id: 1,
        title: 'प्रधानमंत्री फसल बीमा योजना',
        image_link: 'https://agricoop.gov.in/sites/default/files/PMFBY%20Logo%20English.jpg',
        redirect_link: 'https://pmfby.gov.in'
      },
      {
        id: 2,
        title: 'किसान मानधन योजना',
        image_link: 'https://static.pib.gov.in/WriteReadData/userfiles/image/image001UNEV.jpg',
        redirect_link: 'https://pmkmy.gov.in'
      },
      {
        id: 3,
        title: 'नमो ड्रोन योजना',
        image_link: 'https://static.pib.gov.in/WriteReadData/userfiles/image/Nano_Drone.jpeg',
        redirect_link: 'https://namodrone.gov.in'
      }
    ],
    seeAllScreen: 'GovernmentSchemes'
  },
  agricultureTips: {
    tips: [
      {
        id: 1,
        title: 'गेहूं की फसल में खरपतवार नियंत्रण',
        content: 'बुवाई के 30-35 दिन बाद खरपतवार नियंत्रण करें',
        image: 'https://www.dhanuka.com/storage/app/public/blogs/April2022/1650954267Wheat1.jpg'
      },
      {
        id: 2,
        title: 'धान की रोपाई का सही समय',
        content: 'जून के अंतिम सप्ताह से जुलाई का पहला सप्ताह सबसे उपयुक्त',
        image: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202212/paddy_farming_1_1-sixteen_nine.jpg'
      }
    ],
    seeAllScreen: 'AgricultureTips'
  },
  testimonials: {
    items: [
      {
        id: 1,
        name: 'रामलाल यादव',
        village: 'बरेली, उत्तर प्रदेश',
        content: 'कृषि ऐप से मिट्टी की जांच करवाई, अब उपज 40% बढ़ गई है',
        image: 'https://indiafacts.org/wp-content/uploads/2020/06/indian-farmer-1200x900.jpg'
      },
      {
        id: 2,
        name: 'सरिता देवी',
        village: 'मेरठ, उत्तर प्रदेश',
        content: 'मंडी के भाव पता करके सही समय पर बेचा, 25% ज्यादा कमाई हुई',
        image: 'https://static.slab.com/prod/uploads/9ntqdwm5/posts/images/7-JZN1Igl_OD5QwfvDKUjcfG.jpg'
      }
    ],
    seeAllScreen: 'FarmerTestimonials'
  }
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API Service
export const api = {
  // Fetch all home screen data
  getHomeScreenData: async () => {
    try {
      // Simulate API call
      await delay(1000);
      return mockHomeData;
    } catch (error) {
      console.error('Error fetching home screen data:', error);
      throw error;
    }
  },

  // Individual section data fetchers
  getWeatherData: async () => {
    await delay(500);
    return mockHomeData.weather;
  },

  getMarketPrices: async () => {
    await delay(500);
    return mockHomeData.marketPrices;
  },

  getGovernmentSchemes: async () => {
    await delay(500);
    return mockHomeData.schemes;
  },

  getAgricultureTips: async () => {
    await delay(500);
    return mockHomeData.agricultureTips;
  },

  getFarmerTestimonials: async () => {
    await delay(500);
    return mockHomeData.testimonials;
  }
}; 