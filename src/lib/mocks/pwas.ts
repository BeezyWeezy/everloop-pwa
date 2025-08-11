export interface PWA {
    id: string;
    name: string;
    domain: string;
    url?: string;
    status: 'active' | 'draft' | 'paused';
    createdAt: string;
    description?: string;
    downloads?: number;
    rating?: number;
    lastUpdated?: string;
    category?: string;
    iconUrl?: string;
    screenshots?: string[];
    features?: string[];
    config?: {
        themeColor?: string;
        backgroundColor?: string;
        orientation?: string;
        display?: string;
    };
}

export const pwas: PWA[] = [
    {
        id: "pwa_001",
        name: "Zambia Casino A",
        domain: "zambiafun.click",
        url: "https://zambiafun.click",
        status: "active",
        createdAt: "2025-05-12T10:00:00Z",
        description: "Популярное казино приложение для игроков из Замбии",
        downloads: 15420,
        rating: 4.8,
        lastUpdated: "2025-08-01T12:00:00Z",
        category: "Casino",
        iconUrl: "/pwa-icons/zambia-casino.png",
        features: ["Push notifications", "Offline mode", "Touch ID"],
        config: {
            themeColor: "#F5BE37",
            backgroundColor: "#0f172a",
            orientation: "portrait",
            display: "standalone"
        }
    },
    {
        id: "pwa_002", 
        name: "Algeria Slot B",
        domain: "algeriagold.win",
        url: "https://algeriagold.win",
        status: "draft",
        createdAt: "2025-05-10T08:20:00Z",
        description: "Слот-машины и игровые автоматы для Алжира",
        downloads: 8730,
        rating: 4.3,
        lastUpdated: "2025-07-28T15:30:00Z",
        category: "Slots",
        iconUrl: "/pwa-icons/algeria-slots.png",
        features: ["Progressive jackpots", "Bonus games", "Social features"],
        config: {
            themeColor: "#10B981",
            backgroundColor: "#1F2937",
            orientation: "portrait",
            display: "standalone"
        }
    },
    {
        id: "pwa_003",
        name: "Nigeria Sports Bet",
        domain: "nigeriabet.app",
        url: "https://nigeriabet.app",
        status: "active", 
        createdAt: "2025-06-15T14:00:00Z",
        description: "Спортивные ставки и live betting для Нигерии",
        downloads: 23150,
        rating: 4.6,
        lastUpdated: "2025-08-05T09:15:00Z",
        category: "Sports Betting",
        iconUrl: "/pwa-icons/nigeria-sports.png",
        features: ["Live betting", "Stream integration", "Statistics"],
        config: {
            themeColor: "#3B82F6",
            backgroundColor: "#111827",
            orientation: "portrait",
            display: "standalone"
        }
    }
]
