# News Aggregator WebApp

A modern, responsive news aggregator web application built with Next.js, TypeScript, and Tailwind CSS. Stay updated with the latest news from around the world with powerful filtering and search capabilities.

![News Aggregator](https://via.placeholder.com/800x400/3b82f6/ffffff?text=News+Aggregator+WebApp)

## 🚀 Features

- **Real-time News**: Fetch the latest news articles from NewsAPI.org
- **Category Filtering**: Filter news by categories (Technology, Business, Sports, Health, Entertainment, Science)
- **Search Functionality**: Search for specific topics with debounced input
- **Responsive Design**: Mobile-first design that works on all devices
- **Performance Optimized**: Image optimization, caching, and lazy loading
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Modern UI**: Clean, professional interface with smooth animations
- **Error Handling**: Graceful error handling with user-friendly messages

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: NewsAPI.org
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- A NewsAPI.org API key (free tier available)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/news-aggregator.git
cd news-aggregator
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your NewsAPI key to `.env.local`:

```env
NEWS_API_KEY=your_newsapi_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Get your NewsAPI key

1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key
4. Paste it in your `.env.local` file

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
news-aggregator/
├── .github/
│   └── prompts/           # Project documentation
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── news/      # API routes
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/
│   │   └── ui/            # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities and configurations
├── public/                # Static assets
├── .env.example          # Environment variables template
├── tailwind.config.js    # Tailwind configuration
└── README.md
```

## 🎯 Usage

### Browsing News
- The app loads with the latest general news articles
- Articles are displayed in a responsive grid layout
- Click on any article card to read the full article on the original source

### Filtering by Category
- Use the filter buttons at the top to filter news by category
- Available categories: All, General, Business, Technology, Sports, Health, Entertainment, Science
- The active filter is highlighted in blue

### Searching
- Use the search bar to find articles about specific topics
- Search is debounced (300ms delay) to optimize API calls
- Clear the search using the X button or ESC key

### Responsive Design
- **Mobile**: Single column layout with touch-friendly interactions
- **Tablet**: Two-column grid layout
- **Desktop**: Three-column grid layout with hover effects

## 🔧 Configuration

### API Configuration
The app uses NewsAPI.org with the following configuration:
- **Cache Duration**: 30 minutes
- **Default Page Size**: 20 articles
- **Supported Countries**: US (can be modified in `src/lib/newsApi.ts`)

### Tailwind Configuration
Custom theme extensions in `tailwind.config.js`:
- Primary color palette
- Custom animations
- Font family configuration
- Line clamp utilities

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy automatically

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Performance

The application is optimized for performance:
- **Core Web Vitals**: Meets Google's recommended thresholds
- **Image Optimization**: Next.js Image component with responsive sizes
- **Caching**: Server-side API response caching
- **Bundle Size**: Optimized with code splitting and tree shaking

## ♿ Accessibility

The application follows WCAG 2.1 AA guidelines:
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Proper color contrast ratios
- ARIA labels and roles

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NewsAPI.org](https://newsapi.org/) for providing the news data
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel](https://vercel.com/) for seamless deployment

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/news-aggregator/issues) page
2. Create a new issue if your question isn't already answered
3. Provide as much detail as possible about your problem

## 🔮 Future Enhancements

- [ ] User authentication and personalized feeds
- [ ] Article bookmarking and saved articles
- [ ] Real-time updates with WebSocket connections
- [ ] Advanced filtering (date ranges, sources)
- [ ] Dark/light theme toggle
- [ ] Social sharing capabilities
- [ ] Offline reading support
- [ ] Multiple language support
