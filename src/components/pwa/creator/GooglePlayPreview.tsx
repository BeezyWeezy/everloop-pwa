import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Search, 
    HelpCircle, 
    Menu,
    Star,
    Download,
    Share2,
    BookmarkPlus,
    Smartphone,
    Play
} from "lucide-react";

interface GooglePlayPreviewProps {
    data: {
        name: string;
        description: string;
        logo?: string;
        themeColor: string;
        backgroundColor: string;
        accentColor: string;
        category: string;
    };
}

export function GooglePlayPreview({ data }: GooglePlayPreviewProps) {
    const categoryMap: { [key: string]: string } = {
        'casino': 'Entretenimento',
        'slots': 'Jogos',
        'sports': 'Esportes',
        'poker': 'Entretenimento',
        'finance': 'Finanças',
        'crypto': 'Finanças'
    };

    const mappedCategory = categoryMap[data.category] || 'Entretenimento';

    return (
        <div className="w-full max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            {/* Google Play Header - Mini version */}
            <div className="bg-white border-b border-gray-200 px-3 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-normal text-gray-800">Google Play</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Search className="w-3 h-3 text-gray-600" />
                        <Menu className="w-3 h-3 text-gray-600" />
                    </div>
                </div>
            </div>

            {/* App Details */}
            <div className="p-4">
                {/* App Header */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                        {data.logo ? (
                            <img 
                                src={data.logo} 
                                alt={data.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div 
                                className="w-full h-full flex items-center justify-center text-white text-lg font-bold"
                                style={{ backgroundColor: data.themeColor }}
                            >
                                {data.name.charAt(0) || 'A'}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-normal text-gray-900 mb-1 truncate">
                            {data.name || 'Nome do App'}
                        </h3>
                        <p className="text-green-700 text-sm mb-2 hover:underline cursor-pointer">
                            {data.name} Studio
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                            <span>Contém anúncios</span>
                            <span>•</span>
                            <span>Compras no app</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-medium">4.8</span>
                                <Star className="w-3 h-3 fill-current text-green-600" />
                            </div>
                            <span className="text-xs text-gray-600">1M+</span>
                            <Badge 
                                variant="outline" 
                                className="bg-green-50 text-green-700 border-green-200 text-xs px-1 py-0"
                            >
                                Livre
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mb-4">
                    <button 
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Instalar
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <BookmarkPlus className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Device Compatibility */}
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-4 p-2 bg-gray-50 rounded-lg">
                    <Smartphone className="w-3 h-3" />
                    <span>Este app está disponível para todos os seus dispositivos</span>
                </div>

                {/* Screenshots Preview */}
                <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto">
                        {Array.from({ length: 3 }, (_, index) => (
                            <div key={index} className="flex-shrink-0">
                                <div 
                                    className="w-20 h-36 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-white font-medium"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${data.themeColor}, ${data.accentColor})` 
                                    }}
                                >
                                    Tela {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* About */}
                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Sobre este app</h4>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {data.description || "Descrição do aplicativo aparecerá aqui. Este é um exemplo de como seu app será exibido no Google Play Store com todas as informações que você forneceu."}
                    </p>
                </div>

                {/* App Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Categoria</span>
                            <span className="text-gray-900">{mappedCategory}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Desenvolvedor</span>
                            <span className="text-green-700">{data.name} Studio</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tamanho</span>
                            <span className="text-gray-900">25 MB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
