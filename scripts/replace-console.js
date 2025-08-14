#!/usr/bin/env node

/**
 * Скрипт для автоматической замены console.log на логгер
 * Запуск: node scripts/replace-console.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Конфигурация
const SRC_DIR = 'src';
const EXCLUDE_DIRS = ['node_modules', '.next', 'dist', 'build'];
const FILE_EXTENSIONS = ['*.ts', '*.tsx'];

// Паттерны для замены
const REPLACEMENTS = [
  // console.log -> logger.info
  {
    pattern: /console\.log\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(.+?)\s*\)/g,
    replacement: (match, title, data) => `logger.info('${title}', ${data})`,
    description: 'console.log with string and data'
  },
  {
    pattern: /console\.log\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    replacement: (match, title) => `logger.info('${title}')`,
    description: 'console.log with string only'
  },
  {
    pattern: /console\.log\s*\(\s*(.+?)\s*\)/g,
    replacement: (match, data) => `logger.info('Debug', ${data})`,
    description: 'console.log with data only'
  },
  
  // console.error -> logger.error
  {
    pattern: /console\.error\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(.+?)\s*\)/g,
    replacement: (match, title, error) => `logger.error('${title}', ${error})`,
    description: 'console.error with string and error'
  },
  {
    pattern: /console\.error\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    replacement: (match, title) => `logger.error('${title}')`,
    description: 'console.error with string only'
  },
  {
    pattern: /console\.error\s*\(\s*(.+?)\s*\)/g,
    replacement: (match, error) => `logger.error('Error', ${error})`,
    description: 'console.error with error only'
  },
  
  // console.warn -> logger.warning
  {
    pattern: /console\.warn\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(.+?)\s*\)/g,
    replacement: (match, title, data) => `logger.warning('${title}', ${data})`,
    description: 'console.warn with string and data'
  },
  {
    pattern: /console\.warn\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    replacement: (match, title) => `logger.warning('${title}')`,
    description: 'console.warn with string only'
  },
  {
    pattern: /console\.warn\s*\(\s*(.+?)\s*\)/g,
    replacement: (match, data) => `logger.warning('Warning', ${data})`,
    description: 'console.warn with data only'
  }
];

// Функция для получения имени компонента из пути файла
function getComponentName(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const dirName = path.dirname(filePath).split(path.sep).pop();
  
  // Если это компонент, используем имя файла
  if (fileName.includes('Component') || fileName.includes('Step') || fileName.includes('Modal')) {
    return fileName;
  }
  
  // Иначе используем имя директории
  return dirName || fileName;
}

// Функция для проверки, нужно ли добавить импорт логгера
function needsLoggerImport(content) {
  return !content.includes('useLogger') && (
    content.includes('console.log') || 
    content.includes('console.error') || 
    content.includes('console.warn')
  );
}

// Функция для добавления импорта логгера
function addLoggerImport(content, filePath) {
  const componentName = getComponentName(filePath);
  
  // Ищем последний импорт
  const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
  const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
  
  if (lastImportIndex === -1) {
    // Если нет импортов, добавляем в начало
    return `import { useLogger } from '@/lib/utils/logger';\n\n${content}`;
  }
  
  // Добавляем после последнего импорта
  const beforeImports = content.substring(0, lastImportIndex + importLines[importLines.length - 1].length);
  const afterImports = content.substring(lastImportIndex + importLines[importLines.length - 1].length);
  
  return `${beforeImports}\nimport { useLogger } from '@/lib/utils/logger';${afterImports}`;
}

// Функция для добавления объявления логгера
function addLoggerDeclaration(content, filePath) {
  const componentName = getComponentName(filePath);
  
  // Ищем где объявляются хуки (useState, useEffect и т.д.)
  const hookPattern = /const\s+[^=]+=\s+use[A-Z][a-zA-Z]+\(/g;
  const matches = [...content.matchAll(hookPattern)];
  
  if (matches.length === 0) {
    // Если нет хуков, добавляем в начало функции
    const functionPattern = /function\s+\w+\s*\(/g;
    const functionMatch = content.match(functionPattern);
    
    if (functionMatch) {
      const functionIndex = content.indexOf(functionMatch[0]);
      const openBraceIndex = content.indexOf('{', functionIndex);
      
      if (openBraceIndex !== -1) {
        const beforeBrace = content.substring(0, openBraceIndex + 1);
        const afterBrace = content.substring(openBraceIndex + 1);
        
        return `${beforeBrace}\n    const logger = useLogger('${componentName}');\n${afterBrace}`;
      }
    }
    
    return content;
  }
  
  // Добавляем после первого хука
  const firstHook = matches[0];
  const hookIndex = content.indexOf(firstHook[0]);
  const lineEndIndex = content.indexOf('\n', hookIndex);
  
  if (lineEndIndex === -1) {
    return content;
  }
  
  const beforeHook = content.substring(0, lineEndIndex + 1);
  const afterHook = content.substring(lineEndIndex + 1);
  
  return `${beforeHook}    const logger = useLogger('${componentName}');\n${afterHook}`;
}

// Функция для обработки одного файла
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Проверяем, нужно ли добавить импорт
    if (needsLoggerImport(content)) {
      content = addLoggerImport(content, filePath);
      modified = true;
    }
    
    // Добавляем объявление логгера, если его нет
    if (!content.includes('const logger = useLogger')) {
      content = addLoggerDeclaration(content, filePath);
      modified = true;
    }
    
    // Применяем замены
    REPLACEMENTS.forEach(({ pattern, replacement, description }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        console.log(`  ✓ ${description}`);
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Обработан: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Ошибка при обработке ${filePath}:`, error.message);
    return false;
  }
}

// Главная функция
function main() {
  console.log('🔍 Поиск файлов с console.log...\n');
  
  // Находим все файлы
  const files = glob.sync(`${SRC_DIR}/**/*.{ts,tsx}`, {
    ignore: EXCLUDE_DIRS.map(dir => `**/${dir}/**`)
  });
  
  console.log(`Найдено ${files.length} файлов для проверки\n`);
  
  let processedCount = 0;
  let totalReplacements = 0;
  
  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('console.log') || content.includes('console.error') || content.includes('console.warn')) {
      console.log(`📝 Обрабатываю: ${filePath}`);
      
      if (processFile(filePath)) {
        processedCount++;
      }
      
      console.log('');
    }
  });
  
  console.log(`\n🎉 Завершено!`);
  console.log(`📊 Обработано файлов: ${processedCount}`);
  console.log(`\n💡 Следующие шаги:`);
  console.log(`   1. Проверьте изменения в файлах`);
  console.log(`   2. Запустите: npm run dev`);
  console.log(`   3. Протестируйте функциональность`);
  console.log(`   4. Исправьте ошибки TypeScript если есть`);
}

// Запуск скрипта
if (require.main === module) {
  main();
}

module.exports = { processFile, REPLACEMENTS };
