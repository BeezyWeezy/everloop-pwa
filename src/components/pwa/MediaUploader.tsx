import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image, Video, FileImage, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { MediaFile, uploadPWAMedia, deletePWAMedia, validateImage, validateVideo } from '@/lib/mediaApi';

interface MediaUploaderProps {
  pwaId: string;
  type: 'icon' | 'screenshot' | 'video' | 'asset';
  currentFiles: MediaFile[];
  onFilesChange: (files: MediaFile[]) => void;
  maxFiles?: number;
}

export function MediaUploader({ pwaId, type, currentFiles, onFilesChange, maxFiles }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const getTypeConfig = () => {
    switch (type) {
      case 'icon':
        return {
          title: 'Иконки приложения',
          description: 'PNG, ICO, SVG до 2MB. Рекомендуемые размеры: 192x192, 512x512',
          accept: 'image/png,image/x-icon,image/svg+xml',
          icon: <Image className="w-5 h-5" />,
        };
      case 'screenshot':
        return {
          title: 'Скриншоты',
          description: 'PNG, JPG, WebP до 5MB. До 8 скриншотов',
          accept: 'image/png,image/jpeg,image/webp',
          icon: <FileImage className="w-5 h-5" />,
        };
      case 'video':
        return {
          title: 'Видео',
          description: 'MP4, WebM до 50MB. Максимум 30 секунд',
          accept: 'video/mp4,video/webm',
          icon: <Video className="w-5 h-5" />,
        };
      case 'asset':
        return {
          title: 'Дополнительные файлы',
          description: 'Изображения для сплэш-экрана, фона и т.д.',
          accept: 'image/png,image/jpeg,image/webp',
          icon: <FileImage className="w-5 h-5" />,
        };
    }
  };

  const config = getTypeConfig();

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files.length) return;

    // Проверяем лимит файлов
    if (maxFiles && currentFiles.length + files.length > maxFiles) {
      alert(`Максимальное количество файлов: ${maxFiles}`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        let metadata;

        // Валидируем и получаем метаданные
        if (type === 'icon' || type === 'screenshot' || type === 'asset') {
          metadata = await validateImage(file);
        } else if (type === 'video') {
          metadata = await validateVideo(file);
          
          // Проверяем длительность видео
          if (metadata.duration > 30) {
            throw new Error(`Видео "${file.name}" слишком длинное. Максимум 30 секунд.`);
          }
        }

        const { data, error } = await uploadPWAMedia(pwaId, file, type, metadata);
        
        if (error) {
          throw error;
        }

        return data;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      const newFiles = [...currentFiles, ...uploadedFiles.filter(Boolean)] as MediaFile[];
      onFilesChange(newFiles);

    } catch (error) {
      console.error('Ошибка загрузки файлов:', error);
      alert(`Ошибка загрузки: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setUploading(false);
    }
  }, [pwaId, type, currentFiles, onFilesChange, maxFiles]);

  const handleFileDelete = useCallback(async (fileId: string) => {
    const { error } = await deletePWAMedia(pwaId, fileId, type);
    
    if (error) {
      alert(`Ошибка удаления: ${error.message}`);
      return;
    }

    const newFiles = currentFiles.filter(file => file.id !== fileId);
    onFilesChange(newFiles);
  }, [pwaId, type, currentFiles, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {config.icon}
          {config.title}
          {currentFiles.length > 0 && (
            <Badge variant="secondary">{currentFiles.length}</Badge>
          )}
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {config.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Зона загрузки */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            if (!uploading) {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = config.accept;
              input.multiple = type !== 'video'; // Видео - по одному
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files) {
                  handleFileUpload(target.files);
                }
              };
              input.click();
            }
          }}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Загружаем файлы...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-slate-400" />
              <p className="text-sm font-medium">
                Перетащите файлы сюда или нажмите для выбора
              </p>
              <p className="text-xs text-slate-500">
                {config.accept.split(',').join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Список загруженных файлов */}
        {currentFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Загруженные файлы:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentFiles.map((file) => (
                <div
                  key={file.id}
                  className="relative group border rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {/* Превью файла */}
                  <div className="aspect-square mb-2 bg-slate-100 dark:bg-slate-700 rounded-md overflow-hidden">
                    {file.type === 'video' ? (
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Информация о файле */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size)}
                    </p>
                    {file.metadata && (
                      <p className="text-xs text-slate-500">
                        {file.metadata.width}x{file.metadata.height}
                        {file.metadata.duration && (
                          <span> • {Math.round(file.metadata.duration)}s</span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Кнопка удаления */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                    onClick={() => handleFileDelete(file.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
