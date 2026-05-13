#!/usr/bin/env node
/**
 * DEMO: Headless Slide Builder
 * This demonstrates generating a PowerPoint presentation
 */

const demoContent = {
  deckTitle: "Q4 Results Presentation",
  subtitle: "Performance Summary",
  presenter: "Demo User",
  date: new Date().toLocaleDateString(),
  slides: [
    {
      type: "title",
      title: "Q4 Results Presentation",
      subtitle: "Performance Summary"
    },
    {
      type: "content",
      title: "Key Achievements",
      bullets: [
        "Revenue increased by 25%",
        "Launched 3 new features",
        "Customer satisfaction: 92%"
      ]
    }
  ]
};

console.log('Demo: Headless Slide Builder');
console.log('Deck:', demoContent.deckTitle);
console.log('Slides:', demoContent.slides.length);
console.log('\nTo build: npm run build:demo');
