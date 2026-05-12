@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 48 40% 95%; /* Sky Mist Cream */
    --foreground: 220 40% 20%;
    --card: 0 0% 100%;
    --card-foreground: 220 40% 20%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 40% 20%;
    --primary: 46 100% 55%; /* Radiant Gold */
    --primary-foreground: 0 0% 100%;
    --secondary: 48 30% 90%;
    --secondary-foreground: 220 40% 20%;
    --muted: 48 20% 85%;
    --muted-foreground: 220 20% 40%;
    --accent: 24 96% 65%; /* Vibrant Sunset Coral */
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 48 20% 85%;
    --input: 48 20% 85%;
    --ring: 46 100% 55%;
    --radius: 1.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground overflow-hidden;
    background: linear-gradient(135deg, #F7F5ED 0%, #E3F2FD 50%, #F3E5F5 100%);
  }
}

.floating-bubbles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.bubble {
  position: absolute;
  bottom: -100px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  animation: float-up 15s linear infinite;
}

@keyframes float-up {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-120vh) scale(1.5); opacity: 0; }
}

.speech-bubble {
  position: relative;
  background: white;
  border-radius: 1.5rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 4px solid #FFCC1A;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 20%;
  border-width: 20px 20px 0;
  border-style: solid;
  border-color: #FFCC1A transparent;
  display: block;
  width: 0;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: -12px;
  left: calc(20% + 4px);
  border-width: 16px 16px 0;
  border-style: solid;
  border-color: white transparent;
  display: block;
  width: 0;
  z-index: 1;
}
