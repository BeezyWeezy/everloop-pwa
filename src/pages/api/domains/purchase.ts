import { NextApiRequest, NextApiResponse } from 'next';

interface DomainPurchaseRequest {
  domain: string;
  price: number;
  userId: string;
  // Данные для регистрации домена (опционально - используются дефолтные)
  registrant?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
  };
}

interface DomainPurchaseResponse {
  success: boolean;
  transactionId?: string;
  domain?: string;
  expiryDate?: string;
  error?: string;
}

// Namecheap API конфигурация
const NAMECHEAP_API_URL = 'https://api.namecheap.com/xml.response';
const NAMECHEAP_API_USER = process.env.NAMECHEAP_API_USER;
const NAMECHEAP_API_KEY = process.env.NAMECHEAP_API_KEY;
const NAMECHEAP_USERNAME = process.env.NAMECHEAP_USERNAME;
const NAMECHEAP_CLIENT_IP = process.env.NAMECHEAP_CLIENT_IP || '127.0.0.1';

// Функция для получения актуальной цены домена
async function getDomainPrice(tld: string): Promise<number | null> {
  try {
    const params = new URLSearchParams({
      ApiUser: NAMECHEAP_API_USER!,
      ApiKey: NAMECHEAP_API_KEY!,
      UserName: NAMECHEAP_USERNAME!,
      Command: 'namecheap.users.getPricing',
      ClientIp: NAMECHEAP_CLIENT_IP,
      ProductType: 'DOMAIN',
      ActionName: 'REGISTER',
      ProductName: tld
    });

    const response = await fetch(`${NAMECHEAP_API_URL}?${params}`);
    const xmlText = await response.text();
    
    const priceRegex = new RegExp(`Name="${tld}"[^>]*Price="([^"]*)"`, 'i');
    const match = xmlText.match(priceRegex);
    
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching domain price:', error);
    return null;
  }
}

async function registerDomain(
  domain: string, 
  registrant: DomainPurchaseRequest['registrant']
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  
  try {
    const [domainName, tld] = domain.split('.');
    
    const params = new URLSearchParams({
      ApiUser: NAMECHEAP_API_USER!,
      ApiKey: NAMECHEAP_API_KEY!,
      UserName: NAMECHEAP_USERNAME!,
      Command: 'namecheap.domains.create',
      ClientIp: NAMECHEAP_CLIENT_IP,
      DomainName: domainName,
      Years: '1',
      
      // Registrant Contact
      RegistrantFirstName: registrant.firstName,
      RegistrantLastName: registrant.lastName,
      RegistrantAddress1: registrant.address1,
      RegistrantCity: registrant.city,
      RegistrantStateProvince: registrant.stateProvince,
      RegistrantPostalCode: registrant.postalCode,
      RegistrantCountry: registrant.country,
      RegistrantPhone: registrant.phone,
      RegistrantEmailAddress: registrant.email,
      
      // Tech Contact (same as registrant)
      TechFirstName: registrant.firstName,
      TechLastName: registrant.lastName,
      TechAddress1: registrant.address1,
      TechCity: registrant.city,
      TechStateProvince: registrant.stateProvince,
      TechPostalCode: registrant.postalCode,
      TechCountry: registrant.country,
      TechPhone: registrant.phone,
      TechEmailAddress: registrant.email,
      
      // Admin Contact (same as registrant)
      AdminFirstName: registrant.firstName,
      AdminLastName: registrant.lastName,
      AdminAddress1: registrant.address1,
      AdminCity: registrant.city,
      AdminStateProvince: registrant.stateProvince,
      AdminPostalCode: registrant.postalCode,
      AdminCountry: registrant.country,
      AdminPhone: registrant.phone,
      AdminEmailAddress: registrant.email,
      
      // Billing Contact (same as registrant)
      BillingFirstName: registrant.firstName,
      BillingLastName: registrant.lastName,
      BillingAddress1: registrant.address1,
      BillingCity: registrant.city,
      BillingStateProvince: registrant.stateProvince,
      BillingPostalCode: registrant.postalCode,
      BillingCountry: registrant.country,
      BillingPhone: registrant.phone,
      BillingEmailAddress: registrant.email,
    });

    const response = await fetch(`${NAMECHEAP_API_URL}?${params}`, {
      method: 'POST'
    });
    
    const xmlText = await response.text();
    
    // Парсим XML ответ
    if (xmlText.includes('Status="OK"')) {
      // Извлекаем TransactionID
      const transactionIdMatch = xmlText.match(/TransactionID="(\d+)"/);
      const transactionId = transactionIdMatch ? transactionIdMatch[1] : undefined;
      
      return {
        success: true,
        transactionId
      };
    } else {
      // Извлекаем ошибку
      const errorMatch = xmlText.match(/<Error Number="\d+">(.*?)<\/Error>/);
      const error = errorMatch ? errorMatch[1] : 'Unknown error occurred';
      
      return {
        success: false,
        error
      };
    }
    
  } catch (error) {
    console.error('Domain registration error:', error);
    return {
      success: false,
      error: 'Failed to register domain'
    };
  }
}

async function setDomainDNS(domain: string): Promise<boolean> {
  try {
    // Настраиваем DNS на наш сервер
    const params = new URLSearchParams({
      ApiUser: NAMECHEAP_API_USER!,
      ApiKey: NAMECHEAP_API_KEY!,
      UserName: NAMECHEAP_USERNAME!,
      Command: 'namecheap.domains.dns.setDefault',
      ClientIp: NAMECHEAP_CLIENT_IP,
      SLD: domain.split('.')[0],
      TLD: domain.split('.')[1],
    });

    const response = await fetch(`${NAMECHEAP_API_URL}?${params}`);
    const xmlText = await response.text();
    
    return xmlText.includes('Status="OK"');
  } catch (error) {
    console.error('DNS setup error:', error);
    return false;
  }
}

// Мок функция для проверки баланса пользователя
async function getUserBalance(userId: string): Promise<number> {
  // Здесь будет запрос к базе данных
  // Пока возвращаем мок значение
  return 150;
}

// Мок функция для списания с баланса
async function debitUserBalance(userId: string, amount: number): Promise<boolean> {
  // Здесь будет логика списания с баланса пользователя
  const currentBalance = await getUserBalance(userId);
  if (currentBalance >= amount) {
    // Списываем деньги
    console.log(`Debited $${amount} from user ${userId}`);
    return true;
  }
  return false;
}

// Функция для сохранения домена в базу данных
async function saveDomainToDatabase(
  domain: string, 
  userId: string, 
  transactionId: string,
  pwaId?: string
): Promise<void> {
  // Здесь будет сохранение в базу данных
  console.log(`Saving domain ${domain} for user ${userId}, transaction: ${transactionId}`);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DomainPurchaseResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { domain, price, userId, registrant }: DomainPurchaseRequest = req.body;

  // Валидация основных данных
  if (!domain || !price || !userId) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: domain, price, userId' 
    });
  }

  // Дефолтные данные регистранта если не предоставлены
  const defaultRegistrant = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@example.com',
    phone: '+1.1234567890',
    address1: '123 Main St',
    city: 'Anytown',
    stateProvince: 'CA',
    postalCode: '12345',
    country: 'US'
  };

  const finalRegistrant = registrant || defaultRegistrant;

  if (!NAMECHEAP_API_USER || !NAMECHEAP_API_KEY || !NAMECHEAP_USERNAME) {
    return res.status(500).json({ 
      success: false, 
      error: 'Namecheap API credentials not configured' 
    });
  }

  try {
    // 1. Проверяем актуальную цену домена через API
    const [domainName, tld] = domain.split('.');
    const actualPrice = await getDomainPrice(tld);
    
    if (!actualPrice || Math.abs(actualPrice - price) > 0.01) {
      return res.status(400).json({
        success: false,
        error: `Price mismatch. Current price: $${actualPrice}`
      });
    }

    // 2. Проверяем баланс пользователя
    const userBalance = await getUserBalance(userId);
    if (userBalance < price) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance'
      });
    }

    // 3. Регистрируем домен через Namecheap
    const registrationResult = await registerDomain(domain, finalRegistrant);
    
    if (!registrationResult.success) {
      return res.status(400).json({
        success: false,
        error: registrationResult.error || 'Failed to register domain'
      });
    }

    // 4. Списываем деньги с баланса
    const debitSuccess = await debitUserBalance(userId, price);
    if (!debitSuccess) {
      return res.status(500).json({
        success: false,
        error: 'Failed to debit balance'
      });
    }

    // 4. Настраиваем DNS
    await setDomainDNS(domain);

    // 5. Сохраняем в базу данных
    await saveDomainToDatabase(domain, userId, registrationResult.transactionId || '');

    // 6. Возвращаем успешный результат
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    res.status(200).json({
      success: true,
      transactionId: registrationResult.transactionId,
      domain,
      expiryDate: expiryDate.toISOString()
    });

  } catch (error) {
    console.error('Domain purchase error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to purchase domain'
    });
  }
}
