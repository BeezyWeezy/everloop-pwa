// PWA сервис - бизнес-логика для работы с PWA
import { supabase } from '../providers/supabase';
import { PWAProject, PWAListItem, CreatePWARequest, UpdatePWARequest, PWADomain } from '../../types/pwa';

export class PWAService {
  // Создать новый PWA проект
  static async createPWA(data: CreatePWARequest): Promise<{ data: PWAProject | null, error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const pwaData = {
        user_id: user.id,
        language: data.language || 'en',
        name: data.name,
        title: data.title,
        description: data.description,
        domain: data.domain,
        traffic_url: data.traffic_url,
        status: 'draft' as const,
        installs: 0,
        comments: [],
        logo_url: null,
        screenshots: [],
        media_files: {
          icons: [],
          screenshots: [],
          videos: [],
          assets: [],
          banners: []
        }
      };

      const { data: pwa, error } = await supabase
        .from('pwa_projects')
        .insert(pwaData)
        .select()
        .single();

      return { data: pwa, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Получить все PWA проекты пользователя (оптимизированный запрос)
  static async getUserPWAs(): Promise<{ data: PWAListItem[] | null, error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      // Оптимизированный запрос - только нужные поля
      const { data, error } = await supabase
        .from('pwa_projects')
        .select(`
          id,
          name,
          title,
          domain,
          status,
          language,
          installs,
          rating,
          logo_url,
          created_at,
          updated_at,
          published_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Получить конкретный PWA проект
  static async getPWA(id: string): Promise<{ data: PWAProject | null, error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase
        .from('pwa_projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Обновить PWA проект
  static async updatePWA(data: UpdatePWARequest): Promise<{ data: PWAProject | null, error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data: pwa, error } = await supabase
        .from('pwa_projects')
        .update(data)
        .eq('id', data.id)
        .eq('user_id', user.id)
        .select()
        .single();

      return { data: pwa, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Удалить PWA проект
  static async deletePWA(id: string): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: { message: 'User not authenticated' } };
      }

      const { error } = await supabase
        .from('pwa_projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Изменить статус PWA
  static async updatePWAStatus(id: string, status: 'active' | 'paused' | 'draft'): Promise<{ data: PWAProject | null, error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const updateData: any = { status };
      
      // Если активируем, устанавливаем дату деплоя
      if (status === 'active') {
        updateData.deployed_at = new Date().toISOString();
      }

      const { data: pwa, error } = await supabase
        .from('pwa_projects')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      return { data: pwa, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Работа с доменами
  static async addDomainToPWA(pwaId: string, domain: string, isCustom: boolean = false): Promise<{ data: PWADomain | null, error: any }> {
    try {
      const domainData = {
        pwa_id: pwaId,
        domain,
        is_custom: isCustom,
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('pwa_domains')
        .insert(domainData)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getPWADomains(pwaId: string): Promise<{ data: PWADomain[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('pwa_domains')
        .select('*')
        .eq('pwa_id', pwaId);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Обновить логотип PWA
  static async updatePWALogo(pwaId: string, logoUrl: string): Promise<{ data: PWAProject | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('pwa_projects')
        .update({ 
          logo_url: logoUrl,
          last_modified_at: new Date().toISOString()
        })
        .eq('id', pwaId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Добавить скриншот к PWA
  static async addPWAScreenshot(pwaId: string, screenshotUrl: string): Promise<{ data: PWAProject | null, error: any }> {
    try {
      // Сначала получаем текущие скриншоты
      const { data: currentPwa, error: fetchError } = await this.getPWA(pwaId);
      if (fetchError || !currentPwa) {
        return { data: null, error: fetchError };
      }

      const currentScreenshots = currentPwa.screenshots || [];
      const updatedScreenshots = [...currentScreenshots, screenshotUrl];

      const { data, error } = await supabase
        .from('pwa_projects')
        .update({ 
          screenshots: updatedScreenshots,
          last_modified_at: new Date().toISOString()
        })
        .eq('id', pwaId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Удалить скриншот из PWA
  static async removePWAScreenshot(pwaId: string, screenshotUrl: string): Promise<{ data: PWAProject | null, error: any }> {
    try {
      // Сначала получаем текущие скриншоты
      const { data: currentPwa, error: fetchError } = await this.getPWA(pwaId);
      if (fetchError || !currentPwa) {
        return { data: null, error: fetchError };
      }

      const currentScreenshots = currentPwa.screenshots || [];
      const updatedScreenshots = currentScreenshots.filter(url => url !== screenshotUrl);

      const { data, error } = await supabase
        .from('pwa_projects')
        .update({ 
          screenshots: updatedScreenshots,
          last_modified_at: new Date().toISOString()
        })
        .eq('id', pwaId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Удалить логотип PWA
  static async removePWALogo(pwaId: string): Promise<{ data: PWAProject | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('pwa_projects')
        .update({ 
          logo_url: null,
          last_modified_at: new Date().toISOString()
        })
        .eq('id', pwaId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Обновить порядок скриншотов PWA
  static async updatePWAScreenshotsOrder(pwaId: string, screenshots: string[]): Promise<{ data: PWAProject | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('pwa_projects')
        .update({ 
          screenshots: screenshots,
          last_modified_at: new Date().toISOString()
        })
        .eq('id', pwaId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
}
