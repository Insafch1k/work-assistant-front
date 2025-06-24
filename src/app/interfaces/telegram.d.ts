interface TelegramWebAppUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  }
  
  interface TelegramWebAppInitDataUnsafe {
    user?: TelegramWebAppUser;
  }
  
  interface TelegramWebApp {
    initDataUnsafe?: TelegramWebAppInitDataUnsafe;
  }
  
  interface TelegramNamespace {
    WebApp?: TelegramWebApp;
  }
  
  interface Window {
    Telegram?: TelegramNamespace;
  }