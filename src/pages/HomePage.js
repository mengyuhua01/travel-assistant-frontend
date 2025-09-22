import { Button, Typography } from 'antd';
import '../components/CustomCard.css';
import Section from '../components/Section';
import '../components/Section.css';
import './HomePage.css';
import hotPlacesData from '../data/hotPlacesData';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  // Features data
  const featuresData = [
    {
      icon: '🗓️',
      title: 'Easy Planning',
      description: 'Intuitive tools that make trip planning a breeze, not a burden.',
      link: '/previous-plans'
    },
    {
      icon: '👶',
      title: 'Kid-Friendly Focus',
      description: 'Find destinations and activities perfect for children of all ages.',
      link: '/previous-plans'
    },
    {
      icon: '💰',
      title: 'Budget Management',
      description: 'Keep track of expenses and find family-friendly deals and discounts.',
      link: '/previous-plans'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Access your plans anywhere, anytime - perfect for busy parents.',
      link: '/previous-plans'
    }
  ];


  // Family friendly hotels data
  const familyHotelsData = [
    {
      image: 'https://dimg04.c-ctrip.com/images/1mc4712000j13r0ucD9CA_W_1080_808_R5_D.jpg',
      title: '北京索菲特大酒店',
      description: '北京索菲特大酒店位于市中心，地理位置优越。酒店提供宽敞舒适的亲子套房，确保您和家人有足够的空间休息和娱乐。',
      link: 'https://hotels.ctrip.com/hotels/1286148.html?cityid=1'
    },
    {
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
      title: 'Hilton Grand Vacations',
      description: 'Spacious family suites with kitchens and resort amenities.',
      link: '/previous-plans'
    },
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      title: 'Marriott\'s Grande Vista',
      description: 'Orlando resort with water parks and family entertainment.',
      link: '/previous-plans'
    },
    {
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
      title: 'Wyndham Bonnet Creek',
      description: 'Family resort with pools, activities, and shuttle to Disney.',
      link: '/previous-plans'
    }
  ];

  // Testimonials data
  const testimonialsData = [
    {
      icon: '💬',
      title: 'Sarah M.',
      description: '"This app saved me hours of planning time!"',
      author: 'Mom of 3',
      link: '/previous-plans'
    },
    {
      icon: '💬',
      title: 'Jessica L.',
      description: '"Finally, a travel planner that gets families."',
      author: 'Working Mom',
      link: '/previous-plans'
    },
    {
      icon: '💬',
      title: 'Maria R.',
      description: '"Our best family vacation yet, thanks to this tool!"',
      author: 'Adventure Mom',
      link: '/previous-plans'
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Plan Your Perfect <span className="highlight">Family Adventure</span>
            </h1>
            <p className="hero-subtitle">
              Create unforgettable memories with stress-free family travel planning.
              From kid-friendly destinations to budget management, we've got you covered!
            </p>
            <div className="hero-buttons">
              <Button type="primary" size="large" className="cta-primary">
                Start Planning
              </Button>
              <Button size="large" className="cta-secondary">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="hero-image">
            <div className="family-illustration">
              <span className="family-emoji">👨‍👩‍👧‍👦</span>
              <div className="travel-icons">
                <span>✈️</span>
                <span>🏖️</span>
                <span>🎪</span>
                <span>🚗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Section title="Why Moms Love Our Travel Planner" cards={featuresData} />

      {/* Hot Places Section */}
      <Section
        title="Hot Places for Family Adventures"
        cards={hotPlacesData}
        backgroundColor="#f0fdf4"
      />

      {/* Family Friendly Hotels Section */}
      <Section
        title="Family Friendly Hotels"
        cards={familyHotelsData}
        backgroundColor="white"
      />

      {/* Testimonials Section */}
      <Section
        title="What Other Moms Say"
        cards={testimonialsData}
        backgroundColor="#f0fdf4"
      />

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2}>Ready to Plan Your Next Family Adventure?</Title>
            <Paragraph>Join thousands of families who have made their travel dreams come true.</Paragraph>
            <Button type="primary" size="large" className="cta-large">
              Get Started Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;